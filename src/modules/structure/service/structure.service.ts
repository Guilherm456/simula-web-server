import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterDTO } from 'src/interfaces';
import { StructureDTO } from '../entities/DTO/structure.dto';
import { Structure } from '../entities/structures.interface';
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
    Object.keys(structure.parameters).forEach((key) => {
      if (typeof structure.parameters[key] !== 'object') lengthParams++;
      else lengthParams += Object.keys(structure.parameters[key]).length + 1;
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
}
