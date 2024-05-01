import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggerServer } from 'src/loggerServer';
import { SimulacaoController } from 'src/modules/simulacao/controller/simulacao.controller';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';
import { BaseModule } from '../base/base.module';
import { ParametersModule } from '../parameters/parameters.module';
import { SimulacaoSchema } from './interface/simulacao.schema';
import { SimulacaoRepository } from './simulacao.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'simulacao', schema: SimulacaoSchema }]),
    BaseModule,
    ParametersModule,
  ],
  controllers: [SimulacaoController],
  providers: [SimulacaoService, SimulacaoRepository, BaseModule, LoggerServer],
  exports: [SimulacaoService],
})
export class SimulacaoModule {}
