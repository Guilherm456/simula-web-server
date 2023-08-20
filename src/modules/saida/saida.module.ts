import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerServer } from 'src/loggerServer';
import { SaidaService } from './service/saida.service';
import { SaidaController } from './controller/saida.controller';
import { SaidaRepository } from 'src/Mongo/repository/saida.repository';
import { SaidaSchema } from 'src/Mongo/Schemas/saida.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'saida', schema: SaidaSchema }])],
  controllers: [SaidaController],
  providers: [SaidaService, SaidaRepository, LoggerServer],
  exports: [SaidaService],
})
export class SaidaModule {}

