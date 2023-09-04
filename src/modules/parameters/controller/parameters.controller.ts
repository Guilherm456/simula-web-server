import { Controller } from '@nestjs/common';
import { ParametersService } from '../services/parameters.service';

@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}
}
