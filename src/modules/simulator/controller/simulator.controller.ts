import { Controller, Param, Post } from '@nestjs/common';
import { SimulatorService } from '../service/simulator.service';

@Controller('simulator')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Post('/:simulationID/execute')
  async executeSimulation(@Param('simulationID') simulationID: string) {
    return await this.simulatorService.sendToQueue(simulationID);
  }
}
