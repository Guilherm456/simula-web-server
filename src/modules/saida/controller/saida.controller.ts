import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';
import { SaidaService } from '../service/saida.service';

@Controller('saida')
export class SaidaController {
  constructor(
    private readonly saidaService: SaidaService,
    private readonly logger: LoggerServer,
  ) {}

  @Get(':simulationId')
  async getSaidasBySimulationId(@Param('simulationId') simulationId: string) {
    const saidaData =
      await this.saidaService.getSaidasBySimulationId(simulationId);

    if (!saidaData || saidaData.length === 0) {
      throw new HttpException('Saida not found', HttpStatus.NOT_FOUND);
    }

    this.logger.log(`Fetched Saida for Simulation ID: ${simulationId}`);
    return { message: 'Saida data fetched successfully!', data: saidaData };
  }

  @Get()
  async getAllSaidas() {
    const allSaidas = await this.saidaService.getAllSaidas();
    this.logger.log(`Fetched all Saidas`);

    return { message: 'All Saida data fetched successfully!', data: allSaidas };
  }

  @Delete(':simulationId')
  async deleteSaidaBySimulationId(@Param('simulationId') simulationId: string) {
    const deleted =
      await this.saidaService.deleteSaidaBySimulationId(simulationId);

    if (!deleted) {
      throw new HttpException(
        'Failed to delete Saida data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    this.logger.log(`Deleted Saida for Simulation ID: ${simulationId}`);
    return { message: 'Saida data deleted successfully!' };
  }
}
