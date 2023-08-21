import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SimulacaoSchema } from 'src/Mongo/Schemas/simulacao.schema';
import { SimulacaoRepository } from 'src/Mongo/repository/simulacao.repository';
import { LoggerServer } from 'src/loggerServer';
import { SimulacaoController } from 'src/modules/simulacao/controller/simulacao.controller';
import { SimulacaoService } from 'src/modules/simulacao/service/simulacao.service';
import { BaseModule } from '../base/base.module';
import { SaidaModule } from '../saida/saida.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'simulacao', schema: SimulacaoSchema }]),
    BaseModule,
    SaidaModule,
  ],
  controllers: [SimulacaoController],
  providers: [SimulacaoService, SimulacaoRepository, BaseModule, LoggerServer],
})
export class SimulacaoModule {}
