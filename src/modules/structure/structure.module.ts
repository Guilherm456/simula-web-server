import { Module, forwardRef } from '@nestjs/common';
import { BaseModule } from '../base/base.module';
import { StructureController } from './controller/structure.controller';
import { StructureService } from './service/structure.service';

@Module({
  controllers: [StructureController],
  providers: [StructureService],
  exports: [StructureService],
  imports: [forwardRef(() => BaseModule)],
})
export class StructureModule {}
