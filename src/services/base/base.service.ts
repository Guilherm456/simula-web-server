import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { BaseDTO } from 'src/DTO/base.DTO';
import { Base } from 'src/Mongo/Interface/base.interface';

import { BaseRepository } from 'src/Mongo/repository/base.repository';

@Injectable()
export class BaseService {
  constructor(private readonly baseRepository: BaseRepository) {}

  async uploadFiles(files: Array<Express.Multer.File>) {
    const csvConverter = require('csvjson-csv2json');

    if (files === undefined || files.length === 0) {
      console.log('Inviado arquivos inválidos ou nenhum arquivo enviado');
      return new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    console.log(
      `Fazendo o upload dos arquivos e convertendo para JSON. Número de arquivos: ${files.length}`,
    );

    files.forEach((file) => {
      //Verifica o tamanho do arquivo, caso seja muito grande, será avisado no servidor
      if (file.size >= 10000000)
        console.log(
          `Arquivo grande, pode demorar mais que o normal. Tamanho: ${file.size} bytes aproximadamente | Nome: ${file.originalname}`,
        );
      console.log(
        csvConverter(file.buffer.toString('utf-8'), { parseNumbers: true }),
      );
    });

    return 'Arquivos enviados com sucesso!';
    // console.log(files[1].buffer.toString('utf8'));
  }

  async getAllBase(): Promise<Base[]> {
    return await this.baseRepository.getAllBase();
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
    console.log('Recebido a base: ', newBase.name);
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
