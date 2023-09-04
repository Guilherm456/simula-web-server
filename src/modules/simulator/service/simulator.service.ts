import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { LoggerServer } from 'src/loggerServer';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';

import { spawn } from 'child_process';
import { randomUUID } from 'crypto';

import * as Papa from 'papaparse';
import { StructureService } from 'src/modules/structure/service/structure.service';

@Injectable()
export class SimulatorService {
  constructor(
    private readonly simulacaoService: SimulacaoService,
    private readonly structureService: StructureService,
    private readonly logger: LoggerServer,
  ) {}
  private executions_queue: string[] = [];

  async sendToQueue(simulationID: string) {
    const simulacao =
      await this.simulacaoService.getSimulationsByID(simulationID);

    if (!simulacao) {
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);
    }

    if (
      simulacao.status === 'RUNNING' ||
      this.executions_queue.includes(simulationID)
    ) {
      throw new HttpException(
        'Simulação já está em execução',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      this.executions_queue.push(simulationID);

      if (this.executions_queue.length === 1) {
        this.executeSimulacao(simulationID);
        return { message: 'Simulação iniciada' };
      } else
        return {
          message: 'Simulação adicionada na fila de execução',
          queueSize: this.executions_queue.length,
        };
    }
  }

  async executeSimulacao(simulacaoID: string) {
    const simulacao =
      await this.simulacaoService.getSimulationsByID(simulacaoID);
    //Vai buscar a estrutura da base
    const structure = await this.structureService.getStructureByID(
      simulacao.base._id.toString(),
    );
    if (!structure) {
      throw new HttpException(
        'Tipo de estrutura não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    const parameters = await this.structureService.getParameters(
      simulacao.base.parametersID.toString(),
    );
    //Consegue o endereço da pasta da simulação
    const folderExec = path.resolve(`output/${structure.outputFolder}/`);

    this.logger.log(
      `Criando pasta da simulação ${simulacao.name} na pasta ${folderExec}`,
    );

    try {
      //Vai criar a pasta da simulação
      mkdirSync(folderExec, { recursive: true });

      const names = Object.keys(structure.type_parameters);

      for (const name of names) {
        const names_param = Object.keys(structure.type_parameters[name]);
        const actualDir = path.join(folderExec, name);

        if (names_param.length) {
          mkdirSync(actualDir, { recursive: true });
          for (const name_param of names_param) {
            const csv = Papa.unparse(parameters[name][name_param], {
              delimiter: ';',
              quotes: false,
            });

            writeFileSync(path.join(actualDir, `${name_param}.csv`), csv);
          }
        } else {
          const csv = Papa.unparse(parameters[name], {
            delimiter: ';',
            quotes: false,
          });

          writeFileSync(path.join(folderExec, `${name}.csv`), csv, {
            flag: 'w+',
            encoding: 'utf8',
          });
        }
      }

      this.executeCommand(simulacaoID, structure.executeCommand);
    } catch (e) {
      //Caso dê algum erro, vai remover a simulação da fila de execução
      this.executeNext();

      this.simulacaoService.replaceColumn(simulacaoID, 'status', 'ERROR');
      this.logger.error('Algum erro ocorreu ao executar uma simulação');
      this.logger.error(e);
      throw new HttpException(
        'Erro ao criar pasta da simulação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async executeCommand(simulationId: string, command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      spawn(`cd ./output/${1}`, { shell: true });
      const childProc = spawn(`${command}`, { shell: true });
      const id = randomUUID();

      this.simulacaoService.replaceColumn(simulationId, 'status', 'RUNNING');

      childProc.stdout.on('data', (data) => {
        const message = `${data.toString()}`;
        this.logger.log(message, id);
      });

      childProc.stderr.on('data', (data) => {
        const message = `${data.toString()}`;
        this.logger.error(message, id);
      });

      childProc.on('error', (error) => {
        this.logger.error(`${error.message}`, id);
        this.simulacaoService.replaceColumn(simulationId, 'status', 'ERROR');
        reject(error);
      });

      childProc.on('close', (code) => {
        this.executeNext();
        if (code !== 0) {
          const message = `Process exited with code ${code}`;
          this.logger.error(`[${id}] ${message}`);
          this.simulacaoService.replaceColumn(simulationId, 'status', 'ERROR');
          reject(new Error(message));
        }

        this.simulacaoService.replaceColumn(simulationId, 'status', 'FINISHED');
        // this.saidaService.saveParsedData(simulationId);
      });

      resolve(id);
    });
  }

  private async executeNext() {
    if (this.executions_queue.length > 0) {
      this.executeSimulacao(this.executions_queue[0]);
      this.executions_queue.shift();
    }
  }
}
