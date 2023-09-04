import { Module } from '@nestjs/common';
import { ParametersController } from './controller/parameters.controller';
import { ParametersService } from './services/parameters.service';

@Module({
  controllers: [ParametersController],
  providers: [ParametersService],
})
export class ParametersModule {}
