import { Module } from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';
import { ParametersController } from './controller/parameters.controller';
import { ParametersRepository } from './repository/parameter.repository';
import { ParametersService } from './services/parameters.service';

@Module({
  controllers: [ParametersController],
  providers: [ParametersService, LoggerServer, ParametersRepository],
  exports: [ParametersService],
})
export class ParametersModule {}
