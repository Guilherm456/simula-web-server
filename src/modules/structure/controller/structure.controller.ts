import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FilterDTO } from '@types';
import { Roles } from 'src/roles';
import { StructureDTO } from '../entities/DTO/structure.dto';
import { StructureService } from '../service/structure.service';

@Controller('structure')
// @UseInterceptors(CacheInterceptor)
export class StructureController {
  constructor(private readonly structureService: StructureService) {}

  @Get()
  @Roles('guest')
  async getAllStructures(@Query() query?: FilterDTO) {
    return await this.structureService.getAll(query);
  }

  @Post()
  @Roles('admin')
  async saveStructure(@Body() structure: StructureDTO) {
    return await this.structureService.create(structure);
  }

  @Get(':structureID')
  @Roles('guest')
  async getByID(@Param('structureID') structureID: string) {
    return await this.structureService.getByID(structureID);
  }

  @Get(':structureID/parameters')
  @Roles('guest')
  async getParameters(@Param('structureID') structureID: string) {
    return await this.structureService.createParametersObject(structureID);
  }
}
