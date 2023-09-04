import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  StatesInterface,
  StructuresInterface,
} from 'src/Mongo/Interface/structures.interface';
import { BaseService } from 'src/modules/base/service/base.service';
import {
  DengueStructure,
  TesteStructure,
} from 'src/modules/base/structures.object';

@Injectable()
export class StructureService {
  constructor(private readonly baseService: BaseService) {}

  getAllStructures(): StructuresInterface[] {
    return [DengueStructure, TesteStructure];
  }

  getStructureByName(structureName: string): StructuresInterface {
    const structures = this.getAllStructures();
    const structure = structures.find(
      (elemm) => elemm.name.toLowerCase() === structureName.toLowerCase(),
    );
    if (!structure) {
      throw new HttpException('Estrutura não encontrada', HttpStatus.NOT_FOUND);
    } else return structure;
  }

  async getStructureByID(baseID: string): Promise<StructuresInterface> {
    const base = await this.baseService.getBaseByID(baseID);
    if (!base)
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );
    const structure = this.getAllStructures().find(
      (elem) => elem.name.toLowerCase() === base.type.toLowerCase(),
    );
    if (structure === undefined)
      throw new HttpException('Estrutura não encontrada', HttpStatus.NOT_FOUND);
    else return structure;
  }

  getStatesByStructure(name: string): StatesInterface {
    const structure = this.getStructureByName(name);
    if (!structure) return [];
    return structure.states;
  }

  async getStatesByBase(baseID: string): Promise<StatesInterface> {
    const structure = await this.getStructureByID(baseID);
    if (!structure) {
      throw new HttpException('Estrutura não encontrada', HttpStatus.NOT_FOUND);
    }
    return this.getStatesByStructure(structure.name);
  }
}
