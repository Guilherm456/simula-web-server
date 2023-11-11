import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';

import { BaseDTO } from 'src/DTO/base.dto';

import * as csvConverter from 'csvjson-csv2json';
import { Base } from 'src/Mongo/Interface/base.interface';
import { FilterDTO } from 'src/Mongo/Interface/query.interface';
import {
  StatesInterface,
  StructuresInterface,
} from 'src/Mongo/Interface/structures.interface';
import { BaseRepository } from 'src/Mongo/repository/base.repository';
import {
  DengueStructure,
  TesteStructure,
} from 'src/modules/base/structures.object';

@Injectable()
export class BaseService {
  constructor(
    private readonly baseRepository: BaseRepository,
    private readonly logger: LoggerServer,
  ) {}

  convertJSON(file: Express.Multer.File) {
    //Verifica o tamanho do arquivo, caso seja muito grande, será avisado no servidor
    if (file.size >= 10000000)
      this.logger.warn(
        `Arquivo grande, pode demorar mais que o normal. Tamanho: ${file.size} bytes aproximadamente | Nome: ${file.originalname}`,
      );

    return csvConverter(file.buffer.toString('utf-8'), {
      parseNumbers: true,
    });
  }

  async uploadFiles(
    files: Array<Express.Multer.File>,
    structure: string,
    name: string,
  ) {
    if (files === undefined || files.length === 0) {
      this.logger.error('Enviado arquivos inválidos ou nenhum arquivo enviado');
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    structure = structure.toLowerCase();

    const structureObject = this.getStructureByName(structure);
    if (!structureObject)
      throw new HttpException(
        'Estrutura não encontrada',
        HttpStatus.BAD_REQUEST,
      );

    if (structureObject.lengthParams !== files.length)
      throw new HttpException(
        'Número de arquivos enviados é diferente que o necessário para esta simulação',
        HttpStatus.BAD_REQUEST,
      );

    this.logger.log(
      `Fazendo o upload dos arquivos e convertendo para JSON. Número de arquivos: ${files.length}`,
    );

    //Isso permite com que o sistema possa adicionar novos tipos de simulação
    const structureFinal = new BaseDTO();
    structureFinal.name = name;
    structureFinal.parameters = {} as any;
    structureFinal.type = structure as any;
    const params = Object.keys(structureObject.type_parameters);

    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      const subParams = Object.keys(structureObject.type_parameters[param]);

      if (subParams.length === 0)
        structureFinal.parameters[param] = this.convertJSON(files[i]);
      else {
        for (const subParam of subParams) {
          structureFinal.parameters[param][subParam] = this.convertJSON(
            files[i],
          );
          i++;
        }
      }
    }

    try {
      return await this.baseRepository.saveBase(structureFinal);
    } catch (e) {
      throw new HttpException(
        `Erro ao salvar a base ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBases(query: FilterDTO): Promise<Base[]> {
    return await this.baseRepository.getBases(query);
  }

  async getParameters(parametersID: string): Promise<object> {
    return await this.baseRepository.readFile(parametersID);
  }

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
    const base = await this.baseRepository.getBaseByID(baseID);
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

  async getBaseByID(baseID: string): Promise<Base> {
    const base = await this.baseRepository.getBaseByID(baseID);

    if (!base)
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );

    return base;
  }

  async saveBase(newBase: BaseDTO): Promise<Base> {
    return await this.baseRepository.saveBase(newBase);
  }

  async updateBase(baseID: string, newBase: BaseDTO): Promise<Base> {
    try {
      const base = await this.baseRepository.getBaseByID(baseID);
      if (!base)
        throw new HttpException(
          'Nenhuma base encontrada com esse ID',
          HttpStatus.NOT_FOUND,
        );

      await this.baseRepository.updateBase(baseID, newBase, base.parametersID);

      this.logger.warn(`Base atualizada: ${newBase.name}`);
      return this.baseRepository.getBaseByID(baseID);
    } catch (e) {
      this.logger.error(`Erro ao atualizar a base! Erro: ${e}`);

      throw new HttpException(
        'Erro ao atualizar base',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBase(baseID: string): Promise<Base> {
    try {
      const baseDeleted = await this.baseRepository.deleteBase(baseID);

      this.logger.warn(`Base deletada: ${baseDeleted.name}`);
      return baseDeleted;
    } catch (e) {
      throw new HttpException(
        'Algum erro ocorreu ao deletar a base',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
