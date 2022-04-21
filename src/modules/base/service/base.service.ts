import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';

import { BaseDTO } from 'src/DTO/base.DTO';
import { InfluenzaStructure } from 'src/modules/base/structures.object';
import { Base } from 'src/Mongo/Interface/base.interface';
import {
  StatesInterface,
  StructuresInterface,
} from 'src/Mongo/Interface/structures.interface';
import { BaseRepository } from 'src/Mongo/repository/base.repository';

@Injectable()
export class BaseService {
  constructor(
    private readonly baseRepository: BaseRepository,
    private readonly logger: LoggerServer,
  ) {}

  convertJSON(file: Express.Multer.File) {
    const csvConverter = require('csvjson-csv2json');

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
      this.logger.error('Inviado arquivos inválidos ou nenhum arquivo enviado');
      return new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }
    structure = structure.toLowerCase();

    this.logger.log(
      `Fazendo o upload dos arquivos e convertendo para JSON. Número de arquivos: ${files.length}`,
    );

    //Isso permite com que o sistema possa adicionar novos tipos de simulação
    const structureFinal = new BaseDTO();
    structureFinal.name = name;
    switch (structure) {
      case 'influenza':
        if (files.length < 8)
          return new HttpException(
            'Número de arquivos enviados é menor que o necessário para esta simulação',
            HttpStatus.BAD_REQUEST,
          );

        // Irá gerar a estruturação (um ponto a se melhorar é a forma como o sistema identifica os arquivos, ele não deve ser por ordem)
        structureFinal.parameters = {
          Ambiente: {
            AMB: this.convertJSON(files[0]),
            CON: this.convertJSON(files[1]),
            DistribuicaoHumano: this.convertJSON(files[2]),
          },
          Humanos: {
            INI: this.convertJSON(files[3]),
            MOV: this.convertJSON(files[4]),
            CON: this.convertJSON(files[5]),
            TRA: this.convertJSON(files[6]),
          },
          Simulacao: {
            SIM: this.convertJSON(files[7]),
          },
        };
        structureFinal.type = 'influenza';
        return await this.saveBase(structureFinal);

      default:
        return new HttpException(
          'Estrutura não encontrada',
          HttpStatus.BAD_REQUEST,
        );
    }
  }

  async getAllBase(): Promise<Base[]> {
    return await this.baseRepository.getAllBase();
  }

  getAllStructures(): StructuresInterface[] {
    return [InfluenzaStructure];
  }

  getStructureByName(structureName: string): StructuresInterface {
    const structures = this.getAllStructures();
    const structure = structures.find(
      (elemm) => elemm.name.toLowerCase() === structureName.toLowerCase(),
    );
    if (structure == undefined) {
      return null;
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

  async getBaseByID(baseID: string): Promise<Base> {
    try {
      const base = await this.baseRepository.getBaseByID(baseID);
      if (!base)
        throw new HttpException(
          'Nenhuma base encontrada com esse ID',
          HttpStatus.NOT_FOUND,
        );
      return base;
    } catch (e) {
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async saveBase(newBase: BaseDTO): Promise<Base> {
    return await this.baseRepository.saveBase(newBase);
  }

  async updateBase(baseID: string, newBase: BaseDTO): Promise<Base> {
    const base = await this.baseRepository.getBaseByID(baseID);

    if (!baseID)
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );

    const updatedBase = await this.baseRepository.updateBase(baseID, newBase);
    if (updatedBase) {
      this.logger.warn(`Base atualizada: ${updatedBase.name}`);
      return this.baseRepository.getBaseByID(baseID);
    } else {
      this.logger.error('Erro ao atualizar a base!');
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
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
