import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { BaseModule } from './modules/base/base.module';
import { SimulacaoModule } from './modules/simulacao/simulacao.module';

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
