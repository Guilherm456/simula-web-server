import { Controller, Param, Post } from '@nestjs/common';
import { Roles } from 'src/roles';
import { SimulatorService } from '../service/simulator.service';

@Controller('simulator')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Post('/:simulationID/execute')
  @Roles('user')
  async executeSimulation(@Param('simulationID') simulationID: string) {
    return await this.simulatorService.sendToQueue(simulationID);
  }
}
