import { Controller, Param, Post } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/roles';
import { SimulatorService } from '../service/simulator.service';

@Controller('simulator')
@ApiTags('Simulador')
@ApiSecurity('access-token')
export class SimulatorController {
  constructor(private readonly simulatorService: SimulatorService) {}

  @Post('/:simulationID/execute')
  @Roles('user')
  async executeSimulation(@Param('simulationID') simulationID: string) {
    return await this.simulatorService.sendToQueue(simulationID);
  }
}
