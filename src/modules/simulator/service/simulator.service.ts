import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'fs';
import path, { resolve } from 'path';
import { LoggerServer } from 'src/loggerServer';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';

import { spawn } from 'child_process';

import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { unparse } from 'papaparse';
import { StructureService } from 'src/modules/structure/service/structure.service';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';

@Injectable()
@Processor('simulator')
export class SimulatorService {
  constructor(
    private readonly simulacaoService: SimulacaoService,
    private readonly structureService: StructureService,
    private readonly logger: LoggerServer,
    @InjectQueue('simulator') private readonly simulatorQueue: Queue,
  ) {}

  async sendToQueue(simulationID: string) {
    const simulacao =
      await this.simulacaoService.getSimulationByID(simulationID);

    if (!simulacao) {
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);
    }

    if (false) {
      throw new HttpException(
        'Simulação já está em execução',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      this.simulatorQueue.add(simulacao, {
        jobId: simulationID,
      });

      this.logger.log(
        `Adicionando simulação ${simulationID} na fila de execução`,
      );
      return { message: 'Simulação adicionada na fila de execução' };
    }
  }

  @Process()
  async executeSimulacao(job: Job) {
    const simulacao = job.data as Simulacao;

    const structure = await this.structureService.getStructureByID(
      simulacao.base._id.toString(),
    );

    if (!structure)
      throw new HttpException(
        'Tipo de estrutura não encontrada',
        HttpStatus.NOT_FOUND,
      );

    const parameters = {};

    const folderExec = resolve(`output/${structure.outputFolder}/`);

    this.logger.log(
      `Criando pasta da simulação ${simulacao.name} na pasta ${folderExec}`,
    );

    try {
      mkdirSync(folderExec, { recursive: true });

      const names = Object.keys(structure.type_parameters);

      for (const name of names) {
        const names_param = Object.keys(structure.type_parameters[name]);

        const actualDir = path.join(folderExec, name);

        if (names_param.length) {
          mkdirSync(actualDir, { recursive: true });
          for (const name_param of names_param) {
            const csv = unparse(parameters[name][name_param], {
              delimiter: ';',
              quotes: false,
            });

            writeFileSync(path.join(actualDir, `${name_param}.csv`), csv);
          }
        } else {
          const csv = unparse(parameters[name], {
            delimiter: ';',
            quotes: false,
          });

          writeFileSync(path.join(folderExec, `${name}.csv`), csv, {
            flag: 'w+',
            encoding: 'utf8',
          });
        }
      }

      await this.executeCommand(
        simulacao._id.toString(),
        `cd ${folderExec} && ${structure.executeCommand} `,
      );
    } catch (e) {
      this.simulacaoService.replaceColumn(
        simulacao._id.toString(),
        'status',
        'ERROR',
      );
      this.logger.error('Algum erro ocorreu ao executar uma simulação');
      this.logger.error(e);
      throw new HttpException(
        'Erro ao criar pasta da simulação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async executeCommand(simulationId: string, command: string) {
    return new Promise((resolve, reject) => {
      const childProc = spawn(`${command}`, { shell: true });

      this.simulacaoService.replaceColumn(simulationId, 'status', 'RUNNING');

      childProc.stdout.on('data', (data) => {
        const message = `${data.toString()}`;
        this.logger.log(message, simulationId);
      });

      childProc.stderr.on('data', (data) => {
        const message = `${data.toString()}`;
        this.logger.error(message, simulationId);
      });

      childProc.on('error', (error) => {
        this.logger.error(`${error.message}`, simulationId);
        this.simulacaoService.replaceColumn(simulationId, 'status', 'ERROR');
        reject(new Error(error.message));
      });

      childProc.on('close', (code) => {
        if (code !== 0) {
          const message = `Process exited with code ${code}`;
          this.logger.error(`[${simulationId}] ${message}`);
          this.simulacaoService.replaceColumn(simulationId, 'status', 'ERROR');
          reject(new Error(message));
        } else {
          this.simulacaoService.replaceColumn(
            simulationId,
            'status',
            'FINISHED',
          );

          // this.saidaService.saveParsedData(simulationId);
          resolve(simulationId);
        }
      });
    });
  }
}
