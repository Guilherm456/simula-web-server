import { IsNotEmpty } from 'class-validator';

export class ParametersDTO {
  @IsNotEmpty()
  value: string | number;

  min?: number;
  max?: number;
}

export class ParamatersDTODouble {}
