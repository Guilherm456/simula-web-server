import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { SimulacaoDTO } from 'src/DTO/simulacao.dto';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoService } from 'src/services/simulacao/simulacao.service';

@Controller('simulacao')
export class SimulacaoController {
  constructor(private readonly simulacaoService: SimulacaoService) {}

  @Get()
  async getSimulacao() {}

  @Post('/:baseID')
  async saveSimulacao(
    @Body() simulacao: SimulacaoDTO,
    @Param('baseID') baseID: string,
  ): Promise<Simulacao> {
    return await this.simulacaoService.saveSimulacao(simulacao, baseID);
  }
}
