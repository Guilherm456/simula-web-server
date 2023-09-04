import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { FindDTO } from 'src/DTO/agentsFind.tdo';
import { SimulacaoDTO, SimulacaoEditDTO } from 'src/DTO/simulacao.dto';

import { FilterDTO } from 'src/Mongo/Interface/query.interface';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';

@Controller('simulacao')
export class SimulacaoController {
  constructor(private readonly simulacaoService: SimulacaoService) {}

  @Get()
  async getSimulations(query?: FilterDTO): Promise<Simulacao[]> {
    return await this.simulacaoService.getSimulatons(query);
  }

  @Get(':ID')
  async getSimulacaoByID(@Param('ID') ID: string): Promise<Simulacao> {
    return await this.simulacaoService.getSimulationsByID(ID);
  }

  @Get('/status/:status')
  async getSimulacoesByStatus(
    @Param('status') status: string,
  ): Promise<Simulacao[]> {
    return await this.simulacaoService.getSimulationsByStatus(status);
  }

  @Get('/base/:baseID')
  async getSimulacoesByBaseID(
    @Param('baseID') baseID: string,
  ): Promise<Simulacao[]> {
    return await this.simulacaoService.getSimulationsByBaseID(baseID);
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
    return await this.simulacaoService.saveSimulation(simulacao, baseID);
  }

  @Patch(':simulacaoID')
  async updateSimulacao(
    @Param('simulacaoID') simulacaoID: string,
    @Body() newSimulacao: SimulacaoEditDTO,
  ): Promise<Simulacao> {
    return await this.simulacaoService.updateSimulations(
      simulacaoID,
      newSimulacao,
    );
  }

  @Delete(':simulacaoID')
  async deleteSimulacao(@Param('simulacaoID') simulacaoID: string) {
    return await this.simulacaoService.deleteSimulations(simulacaoID);
  }
}
