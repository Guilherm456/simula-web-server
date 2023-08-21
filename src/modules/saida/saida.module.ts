import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaidaSchema } from 'src/Mongo/Schemas/saida.schema';
import { SaidaRepository } from 'src/Mongo/repository/saida.repository';
import { LoggerServer } from 'src/loggerServer';
import { SaidaController } from './controller/saida.controller';
import { SaidaService } from './service/saida.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'saida', schema: SaidaSchema }]),
  ],
  controllers: [SaidaController],
  providers: [SaidaService, SaidaRepository, LoggerServer],
  exports: [SaidaService],
})
export class SaidaModule {}
