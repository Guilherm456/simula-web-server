import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SimulacaoController } from 'src/modules/simulacao/controller/simulacao.controller';
import { SimulacaoRepository } from 'src/Mongo/repository/simulacao.repository';
import { SimulacaoSchema } from 'src/Mongo/Schemas/simulacao.schema';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';
import { BaseModule } from '../base/base.module';
import { LoggerServer } from 'src/loggerServer';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'simulacao', schema: SimulacaoSchema }]),
    BaseModule,
  ],
  controllers: [SimulacaoController],
  providers: [SimulacaoService, SimulacaoRepository, BaseModule, LoggerServer],
})
export class SimulacaoModule {}
