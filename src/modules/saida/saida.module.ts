import { ParametersModule } from '@modules/parameters/parameters.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SimulacaoModule } from '@modules/simulacao/simulacao.module';
import { LoggerServer } from 'src/loggerServer';
import { StructureModule } from '../structure/structure.module';
import { SaidaController } from './controller/saida.controller';
import { OutputSchema } from './ouput.schema';
import { SaidaRepository } from './saida.repository';
import { SaidaService } from './service/saida.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'saida', schema: OutputSchema }]),
    StructureModule,
    ParametersModule,
    SimulacaoModule,
  ],
  controllers: [SaidaController],
  providers: [SaidaService, SaidaRepository, LoggerServer],
  exports: [SaidaService],
})
export class SaidaModule {}
