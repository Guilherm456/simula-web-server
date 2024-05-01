import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { SaidaService } from '../service/saida.service';

@Controller('saida')
@UseInterceptors(CacheInterceptor)
export class SaidaController {
  constructor(private readonly saidaService: SaidaService) {}

  @Get('/all/:id')
  async getDataAllAgents(@Param('id') id: string) {
    return await this.saidaService.getDataAllAgents(id);
  }

  @Get('/:id/:idAgent')
  async getData(@Param('id') id: string, @Param('idAgent') idAgent: string) {
    return await this.saidaService.getData(id, idAgent);
  }

  @Get('/:id')
  async getOutput(@Param('id') id: string) {
    return await this.saidaService.getByID(id);
  }
}
