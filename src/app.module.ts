import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { BaseModule } from './modules/base/base.module';
import { SimulacaoModule } from './modules/simulacao/simulacao.module';
import { AppServerModule } from './modules/app-server/app-server.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}`, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASSWORD,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    BaseModule,
    SimulacaoModule,
    AppServerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
