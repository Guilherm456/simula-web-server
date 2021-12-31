import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BaseService } from 'src/services/base/base.service';
import { BaseController } from 'src/controllers/base/base.controller';
import { BaseRepository } from 'src/Mongo/repository/base.repository';
import { BaseSchema } from 'src/Mongo/Schemas/base.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'base', schema: BaseSchema }])],
  exports: [BaseService],
  controllers: [BaseController],
  providers: [BaseService, BaseRepository],
})
export class BaseModule {}
