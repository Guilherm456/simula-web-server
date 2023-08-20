import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { VisualizacaoService } from '../service/visualizacao.service';

@Controller('visualize')
export class VisualizacaoController {
  constructor(private readonly visualizacaoService: VisualizacaoService) {}

  @Get('humanos/:simulationId')
  async getHumanosQuantidades(@Param('simulationId') simulationId: string) {
    const contents = await this.visualizacaoService.getFileContents(
      simulationId,
      'Quantidades_Humanos_Total.csv',
    );

    if (!contents) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    const data = contents.map((cycle) =>
      cycle.slice(1).reduce((a, b) => a + b, 0),
    );

    return { data };
  }

  @Get('mosquitos/:simulationId')
  async getMosquitosQuantidades(@Param('simulationId') simulationId: string) {
    const contents = await this.visualizacaoService.getFileContents(
      simulationId,
      'Quantidades_Mosquitos_Dengue_Total.csv',
    );

    if (!contents) {
      throw new HttpException('Data not found', HttpStatus.NOT_FOUND);
    }

    const data = contents.map((cycle) =>
      cycle.slice(1).reduce((a, b) => a + b, 0),
    );

    return { data };
  }
}
