import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterDTO } from 'src/interfaces';
import { StructureDTO } from '../entities/DTO/structure.dto';
import {
  Structure,
  StructureParameters,
} from '../entities/structures.interface';
import { StructureRepository } from '../structure.repository';

@Injectable()
export class StructureService {
  constructor(private readonly structureRepository: StructureRepository) {}

  async getAll(FilterDTO?: FilterDTO) {
    return await this.structureRepository.getAllStructures(FilterDTO);
  }

  async getByID(structureID: string) {
    return await this.structureRepository.getByID(structureID);
  }

  async create(structure: StructureDTO) {
    let lengthParams = 0;

    structure.parameters.forEach((parameter) => {
      lengthParams += parameter.subParameters?.length || 1;
    });

    try {
      return await this.structureRepository.create({
        ...structure,
        lengthParams,
      } as unknown as Structure);
    } catch (err) {
      throw new HttpException(
        'Erro ao criar estrutura, verifique os dados e tente novamente. ' + err,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  constructValues(parameter: Exclude<StructureParameters, 'subParameters'>) {
    const values = {};

    parameter.values.forEach((value) => {
      values[value.name] = value.type === 'number' ? 0 : '';
    });
    return [values];
  }

  // Creates an object with the structure and initial values of the parameters
  async createParametersObject(structureID: string) {
    const structureObject = await this.getByID(structureID);

    if (!structureObject)
      throw new HttpException(
        'Estrutura não encontrada',
        HttpStatus.BAD_REQUEST,
      );

    const parametersObject = {};

    const parameters = structureObject.parameters;

    parameters.forEach((parameter) => {
      if (parameter.subParameters?.length > 0) {
        const subParameters = parameter.subParameters;
        parametersObject[parameter.name] = {};
        subParameters.forEach((subParameter) => {
          parametersObject[parameter.name][subParameter.name] =
            this.constructValues(subParameter);
        });
      } else parametersObject[parameter.name] = this.constructValues(parameter);
    });

    return parametersObject;
  }
}
