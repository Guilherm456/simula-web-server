import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { validate, validateOrReject } from 'class-validator';
import { BaseDTO } from 'src/DTO/base.DTO';
import { Base } from 'src/Mongo/Interface/base.interface';

import { BaseRepository } from 'src/Mongo/repository/base.repository';

@Injectable()
export class BaseService {
  constructor(private readonly baseRepository: BaseRepository) {}

  convertJSON(file: Express.Multer.File) {
    const csvConverter = require('csvjson-csv2json');

    //Verifica o tamanho do arquivo, caso seja muito grande, será avisado no servidor
    if (file.size >= 10000000)
      console.log(
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
      console.log('Inviado arquivos inválidos ou nenhum arquivo enviado');
      return new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    console.log(
      `Fazendo o upload dos arquivos e convertendo para JSON. Número de arquivos: ${files.length}`,
    );

    //Isso permite com que o sistema possa adicionar novos tipos de simulação

    const structureFinal = new BaseDTO();
    structureFinal.name = name;
    switch (structure) {
      case 'influenza':
        //Irá gerar a estruturação (um ponto a se melhorar é a forma como o sistema identifica os arquivos, ele não deve ser por ordem)
        structureFinal.parameters = {
          ambiente: {
            // AMB: this.convertJSON(files[0]),
            AMB: [],
            CONV: this.convertJSON(files[1]),
            DISTRIBUICAOHUMANO: this.convertJSON(files[2]),
          },
          humano: {
            INI: this.convertJSON(files[3]),
            MOV: this.convertJSON(files[4]),
            TRA: this.convertJSON(files[5]),
          },
          simulacao: {
            SIM: this.convertJSON(files[6]),
          },
        };
        return await this.saveBase(structureFinal);
        break;

      default:
        return new BadRequestException('Estrutura não encontrada');
    }
  }

  async getAllBase(): Promise<Base[]> {
    return await this.baseRepository.getAllBase();
  }

  getAllStructures(): string[] {
    return [];
  }

  async getBaseByID(baseID: string): Promise<Base> {
    try {
      const base = await this.baseRepository.getBaseByID(baseID);
      if (!base)
        throw new BadRequestException('Nenhuma base encontrada com esse ID');
      return base;
    } catch (e) {
      throw new BadRequestException('Nenhuma base encontrada com esse ID');
    }
  }

  async saveBase(newBase: BaseDTO): Promise<Base> {
    return await this.baseRepository.saveBase(newBase);
  }

  async updateBase(baseID: string, newBase: BaseDTO): Promise<Base> {
    const base = await this.baseRepository.getBaseByID(baseID);

    if (!baseID)
      throw new BadRequestException('Nenhuma base encontrada com esse ID');

    const updatedBase = await this.baseRepository.updateBase(baseID, newBase);
    if (updatedBase) return this.baseRepository.getBaseByID(baseID);
    else throw new BadRequestException('Erro ao atualizar base');
  }

  async deleteBase(baseID: string): Promise<Base> {
    try {
      const baseDeleted = await this.baseRepository.deleteBase(baseID);
      console.log('Base deletada: ', baseDeleted.name);
      return baseDeleted;
    } catch (e) {
      throw new BadRequestException('Nenhuma base encontrada com esse ID');
    }
  }
}
