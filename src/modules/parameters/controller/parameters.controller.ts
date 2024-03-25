import { Controller, Get, Param, Query } from '@nestjs/common';
import { FilterDTO } from '@types';
import { Roles } from 'src/roles';
import { ParametersService } from '../services/parameters.service';

@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

  @Get(':ID')
  @Roles('guest')
  async getParametersByID(
    @Param('ID') ID: string,
    @Query() query: FilterDTO,
  ): Promise<object> {
    return await this.parametersService.getParametersByID(ID, query);
  }
}
