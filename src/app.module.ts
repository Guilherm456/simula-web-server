import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { BaseController } from './controllers/base/base.controller';
import { BaseRepository } from './Mongo/repository/base.repository';
import { BaseSchema } from './Mongo/Schemas/base.schemas';
import { BaseService } from './services/base/base.service';
import { SimulacaoController } from './controllers/simulacao/simulacao.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.USER_MONGO}:${process.env.USER_MONGO_PASSWORD}@cluster0.v27ia.mongodb.net/simulaWEB?retryWrites=true&w=majority`,
    ),
    MongooseModule.forFeature([{ name: 'base', schema: BaseSchema }]),
  ],
  controllers: [BaseController, SimulacaoController],
  providers: [BaseService, BaseRepository],
})
export class AppModule {}
