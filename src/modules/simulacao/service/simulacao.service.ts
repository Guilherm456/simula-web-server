import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { SimulacaoDTO, SimulacaoEditDTO } from 'src/DTO/simulacao.dto';
import { FilterDTO } from 'src/Mongo/Interface/query.interface';
import {
  SearchsProps,
  Simulacao,
} from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoRepository } from 'src/Mongo/repository/simulacao.repository';
import { LoggerServer } from 'src/loggerServer';
import { BaseService } from 'src/modules/base/service/base.service';

@Injectable()
export class SimulacaoService {
  constructor(
    private readonly simulacaoRepository: SimulacaoRepository,
    private readonly baseService: BaseService,
    private readonly logger: LoggerServer,
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
  ): Promise<Simulacao> {
    const base = await this.baseService.getBaseByID(baseID);
    if (base) {
      return await this.simulacaoRepository.saveSimulations(simulacao, base);
    } else throw new HttpException('Base não encontrada', HttpStatus.NOT_FOUND);
  }

  //Busca todas simulações
  async getSimulatons(query?: FilterDTO): Promise<Simulacao[]> {
    return await this.simulacaoRepository.getSimulations(query);
  }

  //Busca uma simulação pelo seu ID
  async getSimulationsByID(ID: string): Promise<Simulacao> {
    const simulacao = await this.simulacaoRepository.getSimulationsByID(ID);
    if (!simulacao) {
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);
    } else return simulacao;
  }

  //Busca todas simulações pelo seus status
  async getSimulationsByStatus(status: string): Promise<Simulacao[]> {
    enum StatusEnum {
      'new' = 'PENDING',
      'running' = 'RUNNING',
      'finished' = 'FINISHED',
      'error' = 'ERROR',
    }

    const statusEnum = StatusEnum[status];

    if (!statusEnum) {
      throw new HttpException('Status não encontrado', HttpStatus.NOT_FOUND);
    }

    return await this.simulacaoRepository.getSimulationsByStatus(statusEnum);
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
  ): Promise<Simulacao> {
    try {
      const simulacaoOld =
        await this.simulacaoRepository.existsSimulations(simulacaoID);
      if (!simulacaoOld) {
        throw new HttpException(
          'Simulação não encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

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

  async deleteSimulations(simulacaoID: string): Promise<Simulacao> {
    const simulacao = await this.getSimulationsByID(simulacaoID);
    if (!simulacao)
      throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);

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

  //Busca os agentes pela suas caracteristicas
  async findAgents(
    simulacaoID: string,
    agents: SearchsProps,
  ): Promise<number[][] | number[]> {
    return [];
    // const simulacao = await this.getSimulacaoByID(simulacaoID);
    // const parameters = await this.baseService.getParameters(
    //   simulacao.base.parametersID.toString(),
    // );
    // if (!simulacao) {
    //   throw new HttpException('Simulação não encontrada', HttpStatus.NOT_FOUND);
    // }
    // const structure = await this.baseService.getStructureByID(
    //   simulacao.base._id.toString(),
    // );
    // if (!structure) {
    //   throw new HttpException(
    //     'Tipo de estrutura não encontrada',
    //     HttpStatus.NOT_FOUND,
    //   );
    // }
    // if (!agents.stateAgent && agents.propertiesAgent.length === 0) {
    //   return [];
    // }
    // try {
    //   this.logger.log(`Buscando agentes na simulação ${simulacao.name}`);
    //   //Vai buscar os dados originais dos agentes
    //   //Pega a partir da estrutura da doença
    //   const whereNeedFind: Array<any> =
    //     parameters[structure.defaultSearch[0]][structure.defaultSearch[1]];
    //   //Vai adicionar um campo para achar os agentes (index de cada um)
    //   let resultsSimulation: DatasProps[] = simulacao.result.map((resul) =>
    //     resul.map((obj, i) => {
    //       Object.defineProperty(obj, 'index', { value: i });
    //       return obj;
    //     }),
    //   );
    //   let agentsFound: number[][] | number[];
    //   //Busca pelas propriedades dos agentes
    //   if (agents.propertiesAgent && agents.propertiesAgent.length > 0) {
    //     const indexFound = [];
    //     //Vai buscar em todas caracteristicas dos agentes
    //     for (let i = 0; i < whereNeedFind.length; i++) {
    //       const whereActual = whereNeedFind[i];
    //       //Verifica todas caracteristicas passadas pelo agente
    //       for (let j = 0; j < agents.propertiesAgent.length; j++) {
    //         const propertie = agents.propertiesAgent[j].properties;
    //         const value = agents.propertiesAgent[j].value;
    //         if (
    //           //Verifica se possui aquela propriedade
    //           whereActual.hasOwnProperty(propertie) &&
    //           //Verifica se os valores são iguais
    //           whereActual[propertie] == value
    //         ) {
    //           indexFound.push(i);
    //         }
    //       }
    //     }
    //     //Caso tenha achado algum agente
    //     if (indexFound.length > 0) {
    //       resultsSimulation = resultsSimulation.map((agents, i) =>
    //         agents.filter((a) => indexFound.includes(a.index)),
    //       );
    //     } else return [];
    //   }
    //   //Vai buscar os agentes pelo estado
    //   if (agents.stateAgent) {
    //     resultsSimulation = resultsSimulation.map((agentsSimulation) =>
    //       agentsSimulation.filter(
    //         (agent) => agent.state === agents.stateAgent.value,
    //       ),
    //     );
    //     //Vai converter os agentes para o nome do agente
    //     agentsFound = resultsSimulation.map((agents) =>
    //       agents.map((agent) => agent.index),
    //     );
    //   } else {
    //     /*
    //       Se não possuir filtro por estado, não necessita filtrar todos os ciclos,
    //       já que todos os ciclos vão contar agentes com a mesma propriedade
    //     */
    //     agentsFound = resultsSimulation[0].map((agents) => agents.index);
    //   }
    //   return agentsFound;
    // } catch (e) {
    //   this.logger.error('Erro ao encontrar o campo defaultSearch | ' + e);
    //   throw new HttpException(
    //     'Erro ao encontrar o campo defaultSearch',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}
