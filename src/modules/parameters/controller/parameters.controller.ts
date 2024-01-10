import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from 'src/roles';
import { ParametersService } from '../services/parameters.service';

@Controller('parameters')
// @UseInterceptors(CacheInterceptor)
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

  @Get(':ID')
  @Roles('guest')
  async getParametersByID(@Param('ID') ID: string): Promise<object> {
    return await this.parametersService.getParametersByID(ID);
  }

  // @Get('/:id')
  // async test(@Param('id') id: string) {
  //   return await this.parametersService.test(id);
  // }
}
