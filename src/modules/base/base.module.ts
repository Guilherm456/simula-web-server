import { ParametersModule } from '@modules/parameters/parameters.module';
import { StructureModule } from '@modules/structure/structure.module';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerServer } from 'src/loggerServer';
import { BaseRepository } from './base.repository';
import { BaseController } from './controller/base.controller';
import { BaseSchema } from './interfaces/base.schemas';
import { BaseService } from './service/base.service';

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
