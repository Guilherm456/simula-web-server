import { BadRequestException, Injectable } from '@nestjs/common';

import { SimulacaoDTO } from 'src/DTO/simulacao.dto';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoRepository } from 'src/Mongo/repository/simulacao.repository';
import { BaseService } from '../../base/service/base.service';

@Injectable()
export class SimulacaoService {
  constructor(
    private readonly simulacaoRepository: SimulacaoRepository,
    private readonly baseService: BaseService,
  ) {}

  async saveSimulacao(
    simulacao: SimulacaoDTO,
    baseID: string,
  ): Promise<Simulacao> {
    const base = await this.baseService.getBaseByID(baseID);
    if (base) {
      return await this.simulacaoRepository.saveSimulacao(simulacao, base);
    } else throw new BadRequestException('Base não encontrada');
  }

  async getAllSimulacoes(): Promise<Simulacao[]> {
    return await this.simulacaoRepository.getAllSimulacoes();
  }

  async getSimulacaoByID(ID: string): Promise<Simulacao> {
    const simulacao = await this.simulacaoRepository.getSimulacaoByID(ID);
    if (!simulacao) throw new BadRequestException('Simulação não encontrada');
    else return simulacao;
  }

  async getSimulacoesByStatus(status: string): Promise<Simulacao[]> {
    switch (status) {
      case 'new':
        return await this.simulacaoRepository.getSimulacoesByStatus({ $eq: 0 });
        break;
      case 'running':
        return await this.simulacaoRepository.getSimulacoesByStatus({
          $gte: 1,
          $lt: 100,
        });
        break;
      case 'finished':
        return await this.simulacaoRepository.getSimulacoesByStatus({
          $gte: 100,
        });
        break;
      default:
        throw new BadRequestException('Status inválido');
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
      throw new BadRequestException('Simulação não encontrada');

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
      console.log('Base deletada: ', simulacaoDeleted.name);
      return simulacaoDeleted;
    } catch (e) {
      throw new BadRequestException('Nenhuma base encontrada com esse ID');
    }
  }
}
