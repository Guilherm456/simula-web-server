import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerServer } from 'src/loggerServer';
import { BaseController } from 'src/modules/base/controller/base.controller';
import { BaseService } from 'src/modules/base/service/base.service';
import { BaseRepository } from 'src/Mongo/repository/base.repository';
import { BaseSchema } from 'src/Mongo/Schemas/base.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'base', schema: BaseSchema }])],
  exports: [BaseService],
  controllers: [BaseController],
  providers: [BaseService, BaseRepository, LoggerServer],
})
export class BaseModule {}
