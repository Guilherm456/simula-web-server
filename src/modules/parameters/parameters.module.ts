import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';
import { ParametersController } from './controller/parameters.controller';
import { ParametersProcessor } from './parameters.processor';
import { ParametersSocket } from './parameters.socket';
import { ParametersRepository } from './repository/parameter.repository';
import { ParametersService } from './services/parameters.service';

@Module({
  controllers: [ParametersController],
  providers: [
    ParametersService,
    LoggerServer,
    ParametersRepository,
    ParametersSocket,
    ParametersProcessor,
  ],
  exports: [ParametersService],
  imports: [
    BullModule.registerQueue({
      name: 'editParameters',
      defaultJobOptions: {},
    }),
  ],
})
export class ParametersModule {}
