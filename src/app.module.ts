import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { BullModule } from '@nestjs/bull';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AppServerModule } from './modules/app-server/app-server.module';
import { BaseModule } from './modules/base/base.module';
import { ParametersModule } from './modules/parameters/parameters.module';
import { SaidaModule } from './modules/saida/saida.module';
import { SimulacaoModule } from './modules/simulacao/simulacao.module';
import { SimulatorModule } from './modules/simulator/simulator.module';
import { RolesGuard } from './modules/users/user.guard';
import { UsersModule } from './modules/users/users.module';

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
    ParametersModule,
    UsersModule,
    SimulatorModule,
    BullModule.forRoot({
      redis: {
        host: `${process.env.REDIS_HOST}`,
        port: +process.env.REDIS_PORT,
      },
    }),
  ],

  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
