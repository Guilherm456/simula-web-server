import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { SimulacaoDTO } from 'src/DTO/simulacao.dto';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoRepository } from 'src/Mongo/repository/simulacao.repository';
import { BaseService } from '../../base/service/base.service';

import { existsSync, writeFileSync, mkdirSync, closeSync } from 'fs';

import { LoggerServer } from 'src/loggerServer';

const queuesExecutions = [];

const path = require('path');
@Injectable()
export class SimulacaoService {
  constructor(
    private readonly simulacaoRepository: SimulacaoRepository,
    private readonly baseService: BaseService,
    private readonly logger: LoggerServer,
  ) {}

  async saveSimulacao(
    simulacao: SimulacaoDTO,
    baseID: string,
  ): Promise<Simulacao> {
    const base = await this.baseService.getBaseByID(baseID);
    if (base) {
      return await this.simulacaoRepository.saveSimulacao(simulacao, base);
    } else throw new HttpException('Base não encontrada', HttpStatus.NOT_FOUND);
  }

  async getAllSimulacoes(): Promise<Simulacao[]> {
    return await this.simulacaoRepository.getAllSimulacoes();
  }

  async getSimulacaoByID(ID: string): Promise<Simulacao> {
    const simulacao = await this.simulacaoRepository.getSimulacaoByID(ID);
    if (!simulacao)
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);
    else return simulacao;
  }

  async getSimulacoesByStatus(status: string): Promise<Simulacao[]> {
    switch (status) {
      case 'new':
        return await this.simulacaoRepository.getSimulacoesByStatus({ $eq: 0 });
      case 'running':
        return await this.simulacaoRepository.getSimulacoesByStatus({
          $gte: 1,
          $lt: 100,
        });
      case 'finished':
        return await this.simulacaoRepository.getSimulacoesByStatus({
          $gte: 100,
        });
      default:
        throw new HttpException('Status inválido', HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async addExecuteSimulacao(simulacaoID: string) {
    if (!queuesExecutions.includes(simulacaoID)) {
      queuesExecutions.push(simulacaoID);
      if (queuesExecutions.length == 1) {
        return await this.executeSimulacao(simulacaoID);
      }
      //Vai passar o tanto de simulações que estão a ser executadas
      return queuesExecutions.length;
    } else return 'Simulação já está na fila de execução';
  }

  async executeSimulacao(simulacaoID: string) {
    const simulacao = await this.getSimulacaoByID(simulacaoID);

    //Vai buscar a estrutura da base
    const structure = await this.baseService.getStructureByID(
      simulacao.base._id.toString(),
    );

    if (structure == undefined)
      throw new HttpException(
        'Tipo de estrutura não encontrada',
        HttpStatus.NOT_FOUND,
      );
    else {
      //Consegue o endereço da pasta da simulação
      const folderExec = path.join(
        path.resolve('lib/simulacao/'),
        `${simulacaoID}/`,
      );

      try {
        //Vai criar a pasta da simulação
        mkdirSync(folderExec, { recursive: true });

        const names = Object.keys(structure.type_parameters);

        for (let i of names) {
          const names_param = Object.keys(structure.type_parameters[i]);
          const atualDir = path.join(folderExec, i);
          mkdirSync(atualDir, { recursive: true });

          for (let j of names_param) {
            //função temporária para testar
            writeFileSync(
              path.join(atualDir, `${j}.csv`),
              JSON.stringify(structure.type_parameters[i][j].map((x) => x)),
              {
                encoding: 'utf-8',
                flag: 'w+',
              },
            );
          }
        }

        return true;
      } catch (e) {
        this.logger.error('Algum erro ocorreu ao executar uma simulação');
        this.logger.error(e);
        throw new HttpException(
          'Erro ao criar pasta da simulação',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async updateSimulacao(
    simulacaoID: string,
    newSimulacao: SimulacaoDTO,
  ): Promise<Simulacao> {
    const simulacaoOld = await this.simulacaoRepository.getSimulacaoByID(
      simulacaoID,
    );
    if (!simulacaoOld)
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);

    return await this.simulacaoRepository.updateSimulacao(
      simulacaoID,
      newSimulacao,
    );
  }

  async deleteSimulacao(simulacaoID: string): Promise<Simulacao> {
    try {
      const simulacaoDeleted = await this.simulacaoRepository.deleteSimulacao(
        simulacaoID,
      );
      this.logger.warn(`Base deletada: ${simulacaoDeleted.name}`);
      return simulacaoDeleted;
    } catch (e) {
      this.logger.error('Solicitação de exclusão de base não existente');
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
