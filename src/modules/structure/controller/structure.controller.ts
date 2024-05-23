import { CacheInterceptor } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { FilterDTO } from '@types';
import { Roles } from 'src/roles';
import { StructureCreateDTO } from '../entities/DTO/structure.dto';
import { StructureService } from '../service/structure.service';

@Controller('structure')
@UseInterceptors(CacheInterceptor)
@ApiTags('Estruturas')
@ApiSecurity('access-token')
export class StructureController {
  constructor(private readonly structureService: StructureService) {}

  @Get()
  @Roles('guest')
  async getAllStructures(@Query() query?: FilterDTO) {
    return await this.structureService.getAll(query);
  }

  @Post()
  @Roles('admin')
  async saveStructure(@Body() structure: StructureCreateDTO) {
    return await this.structureService.create(structure);
  }

  @Put(':structureID')
  @Roles('admin')
  async updateStructure(
    @Param('structureID') structureID: string,
    @Body() structure: StructureCreateDTO,
  ) {
    return await this.structureService.update(structureID, structure);
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
