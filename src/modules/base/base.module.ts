import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseSchema } from 'src/Mongo/Schemas/base.schemas';
import { BaseRepository } from 'src/Mongo/repository/base.repository';
import { LoggerServer } from 'src/loggerServer';
import { BaseController } from 'src/modules/base/controller/base.controller';
import { BaseService } from 'src/modules/base/service/base.service';
import { ParametersModule } from '../parameters/parameters.module';
import { StructureModule } from '../structure/structure.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'base', schema: BaseSchema }]),
    ParametersModule,
    forwardRef(() => StructureModule),
  ],
  exports: [BaseService],
  controllers: [BaseController],
  providers: [BaseService, BaseRepository, LoggerServer],
})
export class BaseModule {}
