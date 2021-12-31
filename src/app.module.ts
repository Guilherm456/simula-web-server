import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { BaseSchema } from './Mongo/Schemas/base.schemas';
import { BaseRepository } from './Mongo/repository/base.repository';
import { BaseModule } from './modules/base/base.module';

import { SimulacaoSchema } from './Mongo/Schemas/simulacao.schema';
import { SimulacaoModule } from './modules/simulacao/simulacao.module';
import { SimulacaoRepository } from './Mongo/repository/simulacao.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.USER_MONGO}:${process.env.USER_MONGO_PASSWORD}@cluster0.v27ia.mongodb.net/simulaWEB?retryWrites=true&w=majority`,
    ),

    BaseModule,
    SimulacaoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
