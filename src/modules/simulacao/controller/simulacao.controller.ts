import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { MiddlewareRequest } from '@types';

import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FilterDTO } from 'src/interfaces/query.interface';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';
import { Roles } from 'src/roles';
import { SimulacaoCreateDTO } from '../interface';
import { Simulacao } from '../interface/simulacao.interface';

@Controller('simulacao')
@UseInterceptors(CacheInterceptor)
@ApiTags('Simulação')
@ApiSecurity('access-token')
export class SimulacaoController {
  constructor(private readonly simulacaoService: SimulacaoService) {}

  @Get()
  @Roles('guest')
  async getSimulations(@Query() query?: FilterDTO) {
    return await this.simulacaoService.getSimulatons(query);
  }

  @Get(':ID')
  @Roles('guest')
  async getSimulacaoByID(@Param('ID') ID: string): Promise<Simulacao> {
    return await this.simulacaoService.getSimulationByID(ID);
  }

  @Get('/base/:baseID')
  @Roles('guest')
  async getSimulacoesByBaseID(
    @Param('baseID') baseID: string,
  ): Promise<Simulacao[]> {
    return await this.simulacaoService.getSimulationsByBaseID(baseID);
  }

  @Post('/:baseID')
  @Roles('user')
  async saveSimulacao(
    @Body() simulacao: SimulacaoCreateDTO,
    @Param('baseID') baseID: string,
    @Request() req: MiddlewareRequest,
  ): Promise<Simulacao> {
    return await this.simulacaoService.saveSimulation(
      simulacao,
      baseID,
      req.user.id,
    );
  }

  @Put(':simulacaoID')
  @Roles('user')
  async updateSimulacao(
    @Param('simulacaoID') simulacaoID: string,
    @Body() newSimulacao: SimulacaoCreateDTO,
    @Request() req: MiddlewareRequest,
  ): Promise<Simulacao> {
    return await this.simulacaoService.updateSimulations(
      simulacaoID,
      newSimulacao,
      req.user.id,
    );
  }

  @Delete(':simulacaoID')
  @Roles('user')
  async deleteSimulacao(
    @Param('simulacaoID') simulacaoID: string,
    @Request() req: MiddlewareRequest,
  ) {
    return await this.simulacaoService.deleteSimulations(
      simulacaoID,
      req.user.id,
    );
  }
}
