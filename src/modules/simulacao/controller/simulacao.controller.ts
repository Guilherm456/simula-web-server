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
import { SimulacaoDTO } from 'src/DTO/simulacao.dto';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { Simulacao } from 'src/Mongo/Interface/simulacao.interface';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';

@Controller('simulacao')
@UseInterceptors(CacheInterceptor)
export class SimulacaoController {
  constructor(private readonly simulacaoService: SimulacaoService) {}

  // // Execute simulation
  // @Post('/execute')
  // async executeSimulacao(
  //   @Param('simulacaoID') simulacaoID: string,
  // ): Promise<string> {
  //   return await this.simulacaoService.executeSimulacao(simulacaoID);
  // }

  // Get simulation status
  // @Get('/:simulacaoID/status')
  // async getSimulacaoStatus(
  //   @Param('simulacaoID') simulacaoID: string,
  // ): Promise<ProcessExecution> {
  //   return await this.simulacaoService.getSimulacaoStatus(simulacaoID);
  // }

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
