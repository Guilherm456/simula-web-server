import { Controller, Get } from '@nestjs/common';
import { StructureService } from '../service/structure.service';

@Controller('structure')
export class StructureController {
  constructor(private readonly structureService: StructureService) {}

  @Get()
  async getAllStructures() {
    // return this.structureService.();
  }
}
