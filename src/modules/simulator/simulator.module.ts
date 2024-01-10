import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';
import { SimulacaoModule } from '../simulacao/simulacao.module';
import { StructureModule } from '../structure/structure.module';
import { SimulatorController } from './controller/simulator.controller';
import { SimulatorService } from './service/simulator.service';

@Module({
  imports: [
    SimulacaoModule,
    StructureModule,
    BullModule.registerQueue({
      name: 'simulator',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
  ],
  controllers: [SimulatorController],
  providers: [SimulatorService, LoggerServer],
})
export class SimulatorModule {}
