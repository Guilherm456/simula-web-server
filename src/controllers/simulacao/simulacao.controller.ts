import { Controller, Get } from '@nestjs/common';

@Controller('simulacao')
export class SimulacaoController {
  @Get()
  async getSimulacao() {}
}
