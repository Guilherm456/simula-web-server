import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { FilterDTO } from 'src/interfaces/query.interface';
import { LoggerServer } from 'src/loggerServer';
import { BaseService } from 'src/modules/base/service/base.service';
import { ParametersService } from 'src/modules/parameters/services/parameters.service';
import { SimulacaoDTO, SimulacaoEditDTO } from '../interface';
import { Simulacao } from '../interface/simulacao.interface';
import { SimulacaoRepository } from '../simulacao.repository';

@Injectable()
export class SimulacaoService {
  constructor(
    private readonly simulacaoRepository: SimulacaoRepository,
    private readonly baseService: BaseService,
    private readonly logger: LoggerServer,
    private readonly parametersService: ParametersService,
  ) {}

  //Altera o valor de um campo da simulação
  async replaceColumn(simulacaoID: string, nameColumn: string, newValue: any) {
    try {
      return await this.simulacaoRepository.replaceColumn(
        simulacaoID,
        nameColumn,
        newValue,
      );
    } catch {
      throw new HttpException(
        'Erro ao atualizar a simulação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Salva uma simulação
  async saveSimulation(
    simulacao: SimulacaoDTO,
    baseID: string,
    userID: string,
  ): Promise<Simulacao> {
    const base = await this.baseService.getBaseByID(baseID);
    if (!base)
      throw new HttpException('Base não encontrada', HttpStatus.NOT_FOUND);

    const newsParameters = await this.parametersService.duplicateAllParameters(
      base.parameters,
    );
    return await this.simulacaoRepository.saveSimulations(
      {
        ...simulacao,
        parameters: newsParameters,
        user: userID,
        base: baseID,
        structure: base.type,
      },
      base,
    );
  }

  //Busca todas simulações
  async getSimulatons(query?: FilterDTO) {
    return await this.simulacaoRepository.getSimulations(query);
  }

  //Busca uma simulação pelo seu ID
  async getSimulationByID(ID: string): Promise<Simulacao> {
    const simulacao = await this.simulacaoRepository.getSimulationsByID(ID);
    if (!simulacao) {
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);
    } else return simulacao;
  }

  //Busca todas simulações pelo ID da base
  async getSimulationsByBaseID(baseID: string): Promise<Simulacao[]> {
    return this.simulacaoRepository.getSimulationsByBaseID(baseID);
  }

  //Checa se existe uma simulação com o ID passado
  async existsSimulations(simulacaoID: string): Promise<boolean> {
    return await this.simulacaoRepository.existsSimulations(simulacaoID);
  }

  //Atualiza uma simulação
  async updateSimulations(
    simulacaoID: string,
    newSimulacao: SimulacaoEditDTO,
    userID: string,
  ): Promise<Simulacao> {
    const simulacaoOld =
      await this.simulacaoRepository.getSimulationsByID(simulacaoID);
    if (!simulacaoOld)
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);

    if (simulacaoOld.user != userID)
      throw new HttpException(
        'Você não tem permissão para alterar essa simulação',
        HttpStatus.UNAUTHORIZED,
      );

    try {
      return await this.simulacaoRepository.updateSimulations(
        simulacaoID,
        newSimulacao,
      );
    } catch (e) {
      throw new HttpException(
        'Erro ao atualizar simulação',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteSimulations(
    simulacaoID: string,
    userID: string,
  ): Promise<Simulacao> {
    const simulacao = await this.getSimulationByID(simulacaoID);
    if (!simulacao)
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);

    if (simulacao.user != userID)
      throw new HttpException(
        'Você não tem permissão para deletar essa simulação',
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const simulacaoDeleted =
        await this.simulacaoRepository.deleteSimulations(simulacaoID);
      this.logger.warn(`Base deletada: ${simulacaoDeleted.name}`);
      return simulacaoDeleted;
    } catch (e) {
      throw new HttpException(
        'Algum erro ocorreu ao deletar a simulação',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
