import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { SimulacaoDTO } from 'src/DTO/simulacao.dto';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';
import { BaseService } from 'src/modules/base/service/base.service';

@Controller('simulacao')
export class SimulacaoController {
  constructor(private readonly simulacaoService: SimulacaoService) {}

  @Get()
  async getAllSimulacoes(): Promise<Simulacao[]> {
    return await this.simulacaoService.getAllSimulacoes();
  }

  @Get(':ID')
  async getSimulacaoByID(@Param('ID') ID: string): Promise<Simulacao> {
    return await this.simulacaoService.getSimulacaoByID(ID);
  }

  @Get('/status/:status')
  async getSimulacoesByStatus(
    @Param('status') status: string,
  ): Promise<Simulacao[]> {
    return await this.simulacaoService.getSimulacoesByStatus(status);
  }

  @Get('/base/:baseID')
  async getSimulacoesByBaseID(
    @Param('baseID') baseID: string,
  ): Promise<Simulacao[]> {
    return await this.simulacaoService.getSimulacoesByBaseID(baseID);
  }

  @Post('/:simulacaoID/execute')
  async executeSimulacao(@Param('simulacaoID') simulacaoID: string) {
    return await this.simulacaoService.addExecuteSimulacao(simulacaoID);
  }

  @Post('/:baseID')
  async saveSimulacao(
    @Body() simulacao: SimulacaoDTO,
    @Param('baseID') baseID: string,
  ): Promise<Simulacao> {
    return await this.simulacaoService.saveSimulacao(simulacao, baseID);
  }

  @Patch(':simulacaoID')
  async updateSimulacao(
    @Param('simulacaoID') simulacaoID: string,
    @Body() newSimulacao: SimulacaoDTO,
  ): Promise<Simulacao> {
    return await this.simulacaoService.updateSimulacao(
      simulacaoID,
      newSimulacao,
    );
  }

  @Delete(':simulacaoID')
  async deleteSimulacao(@Param('simulacaoID') simulacaoID: string) {
    return await this.simulacaoService.deleteSimulacao(simulacaoID);
  }
}
