import { BadRequestException, Injectable } from '@nestjs/common';

import { SimulacaoDTO } from 'src/DTO/simulacao.dto';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoRepository } from 'src/Mongo/repository/simulacao.repository';
import { BaseService } from '../base/base.service';

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
}
