import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { LoggerServer } from 'src/loggerServer';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';

import { spawn } from 'child_process';

import { Simulacao } from '@modules/simulacao/interface/simulacao.interface';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { mkdir, writeFile } from 'fs/promises';
import { unparse } from 'papaparse';
import { ParametersService } from 'src/modules/parameters/services/parameters.service';
import { SaidaService } from 'src/modules/saida/service/saida.service';
import { StructureService } from 'src/modules/structure/service/structure.service';

@Injectable()
@Processor('simulator')
export class SimulatorService {
  constructor(
    private readonly simulacaoService: SimulacaoService,
    private readonly structureService: StructureService,
    private readonly logger: LoggerServer,
    private readonly saidaService: SaidaService,
    private readonly parametersService: ParametersService,
    @InjectQueue('simulator') private readonly simulatorQueue: Queue,
  ) {}

  async sendToQueue(simulationID: string) {
    const simulacao =
      await this.simulacaoService.getSimulationByID(simulationID);

    if (!simulacao) {
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);
    }

    if (
      (await this.simulatorQueue.getJob(simulationID)) ||
      simulacao.status === 'RUNNING'
    ) {
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

  async creteFile(fileName: string, data: object) {
    const csv = unparse(data as any, {
      delimiter: ';',
      quotes: false,
    });

    await writeFile(fileName, csv, {
      flag: 'w+',
      encoding: 'utf8',
    });
  }

  @Process()
  async executeSimulacao(job: Job) {
    const simulation = job.data as Simulacao;

    const structure = await this.structureService.getByID(
      simulation.structure as string,
    );

    if (!structure)
      throw new HttpException(
        'Tipo de estrutura não encontrada',
        HttpStatus.NOT_FOUND,
      );

    const parameters = await this.parametersService.getAllParameters(
      simulation.parameters,
    );

    const folderExec = resolve(`output/${structure.folder}`);

    this.logger.log(
      `Criando pasta da simulação ${simulation.name} na pasta ${folderExec}`,
    );

    try {
      const folderInput = `${folderExec}/${structure.inputsFolder || ''}`;
      await mkdir(folderInput, { recursive: true });
      const names = Object.keys(structure.parameters);

      await Promise.all(
        names.map(async (name) => {
          const names_param = Object.keys(structure.parameters[name]);

          if (names_param.length > 0) {
            const actualDir = `${folderInput}/${name}`;
            await mkdir(actualDir, { recursive: true });

            await Promise.all(
              names_param.map(async (name_param) => {
                await this.creteFile(
                  `${actualDir}/${name_param}.csv`,
                  parameters[name][name_param],
                );
              }),
            );
          } else
            await this.creteFile(
              `${folderInput}/${name}.csv`,
              parameters[name],
            );
        }),
      );

      await this.executeCommand(
        simulation,
        `cd ${folderExec} && ${structure.executeCommand} `,
      );
      this.logger.log(`Simulação ${simulation.name} executada com sucesso!`);
    } catch (e) {
      this.simulacaoService.replaceColumn(
        simulation._id.toString(),
        'status',
        'ERROR',
      );

      this.logger.error(
        `Algum erro ocorreu ao executar a simulação ${simulation.name}! Erro: ${e}`,
      );
      throw new HttpException(
        'Erro ao criar pasta da simulação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async executeCommand(simulation: Simulacao, command: string) {
    const simulationId = simulation._id.toString();
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

          this.saidaService.saveParsedData(simulation);
          resolve(simulationId);
        }
      });
    });
  }
}
