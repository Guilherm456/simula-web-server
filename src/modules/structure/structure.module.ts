import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StructureController } from './controller/structure.controller';
import { StructureSchema } from './entities/structure.schema';
import { StructureService } from './service/structure.service';
import { StructureRepository } from './structure.repository';

@Module({
  controllers: [StructureController],
  providers: [StructureService, StructureRepository],
  exports: [StructureService],
  imports: [
    MongooseModule.forFeature([
      { name: 'structures', schema: StructureSchema },
    ]),
  ],
})
export class StructureModule {}
