import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';

import { FindDTO } from 'src/DTO/agentsFind.tdo';
import { SimulacaoDTO, SimulacaoDTOEdit } from 'src/DTO/simulacao.dto';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { FilterDTO } from 'src/Mongo/Interface/query.interface';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';

@Controller('simulacao')
@UseInterceptors(CacheInterceptor)
export class SimulacaoController {
  constructor(private readonly simulacaoService: SimulacaoService) {}

  @Get()
  async getSimulations(query?: FilterDTO): Promise<Simulacao[]> {
    return await this.simulacaoService.getSimulatons(query);
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

  @Post('/:simulacaoID/findAgents')
  async findAgents(
    @Param('simulacaoID') simulacaoID: string,
    @Body() data: FindDTO,
  ): Promise<number[][] | number[]> {
    return await this.simulacaoService.findAgents(simulacaoID, data);
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
    @Body() newSimulacao: SimulacaoDTOEdit,
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
