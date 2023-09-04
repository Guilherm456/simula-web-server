import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CacheModule } from '@nestjs/cache-manager';
import { AppServerModule } from './modules/app-server/app-server.module';
import { BaseModule } from './modules/base/base.module';
import { ParametersModule } from './modules/parameters/parameters.module';
import { SaidaModule } from './modules/saida/saida.module';
import { SimulacaoModule } from './modules/simulacao/simulacao.module';
import { VisualizacaoModule } from './modules/visualizacao/visualizacao.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
    }),
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}`, {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASSWORD,
      // useUnifiedTopology: true,
      // useNewUrlParser: true,
    }),
    BaseModule,
    SimulacaoModule,
    SaidaModule,
    AppServerModule,
    CacheModule.register({
      isGlobal: true,
      max: 15,

      ttl: 60 * 1000,
    }),
    SaidaModule,
    VisualizacaoModule,
    ParametersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
