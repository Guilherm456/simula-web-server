import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AgentsStructureDTO } from './agents.dto';

@ValidatorConstraint({ name: 'ComplexParametersValidator', async: false })
export class ComplexParametersValidator
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const isValidArray = (value) => Array.isArray(value) && value.length === 1;

    const keys = Object.keys(value);

    for (const key of keys) {
      const element = value[key];

      if (typeof element !== 'object') {
        return isValidArray(element);
      } else {
        const subKeys = Object.keys(element);

        for (const subKey of subKeys) {
          const subElement = element[subKey];

          return isValidArray(subElement);
        }
      }
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Parameters must follow the specified structure rules';
  }
}

export class StructureDTO {
  @IsString()
  @MinLength(4)
  name: string;

  @IsNotEmpty()
  @Validate(ComplexParametersValidator)
  parameters: object;

  @IsString()
  @IsOptional()
  inputsFolder: string;

  @IsString()
  @IsNotEmpty()
  folder: string;

  @IsString()
  @IsOptional()
  resultsFolder: string;

  @IsString()
  @IsNotEmpty()
  executeCommand: string;

  @IsArray()
  @IsNotEmpty()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @ArrayUnique((agent: AgentsStructureDTO) => agent.label, {
    message: 'Label must be unique',
  })
  @ArrayUnique((agent: AgentsStructureDTO) => agent.color, {
    message: 'Color must be unique',
  })
  @Type(() => AgentsStructureDTO)
  agents: AgentsStructureDTO[];
}
