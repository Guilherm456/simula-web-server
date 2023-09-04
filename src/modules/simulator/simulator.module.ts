import { Module } from '@nestjs/common';
import { SimulacaoModule } from '../simulacao/simulacao.module';
import { StructureModule } from '../structure/structure.module';
import { SimulatorController } from './controller/simulator.controller';
import { SimulatorService } from './service/simulator.service';

@Module({
  imports: [SimulacaoModule, StructureModule],
  controllers: [SimulatorController],
  providers: [SimulatorService],
})
export class SimulatorModule {}
