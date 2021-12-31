import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SimulacaoController } from 'src/controllers/simulacao/simulacao.controller';
import { SimulacaoRepository } from 'src/Mongo/repository/simulacao.repository';
import { SimulacaoSchema } from 'src/Mongo/Schemas/simulacao.schema';
import { SimulacaoService } from 'src/services/simulacao/simulacao.service';
import { BaseModule } from '../base/base.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'simulacao', schema: SimulacaoSchema }]),
    BaseModule,
  ],
  controllers: [SimulacaoController],
  providers: [SimulacaoService, SimulacaoRepository],
})
export class SimulacaoModule {}
