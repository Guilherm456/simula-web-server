import { ParametersModule } from '@modules/parameters/parameters.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggerServer } from 'src/loggerServer';
import { StructureModule } from '../structure/structure.module';
import { SaidaController } from './controller/saida.controller';
import { SaidaRepository } from './saida.repository';
import { SaidaSchema } from './saida.schema';
import { SaidaService } from './service/saida.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'saida', schema: SaidaSchema }]),
    StructureModule,
    ParametersModule,
  ],
  controllers: [SaidaController],
  providers: [SaidaService, SaidaRepository, LoggerServer],
  exports: [SaidaService],
})
export class SaidaModule {}
