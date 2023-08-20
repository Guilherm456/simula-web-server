import { Injectable } from '@nestjs/common';
import { SaidaService } from '../../saida/service/saida.service';

@Injectable()
export class VisualizacaoService{
  constructor(private readonly saidaService: SaidaService) {}

  async getFileContents(simulationId: string, fileName: string): Promise<number[][] | null> {
    const saidaData = await this.saidaService.getSaidasBySimulationId(simulationId);

    if (!saidaData || saidaData.length === 0 || !saidaData[0].data) {
      return null;
    }

    return saidaData[0].data[fileName];
  }
}
