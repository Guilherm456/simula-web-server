import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseDTO } from 'src/DTO/base.DTO';
import { Base } from 'src/Mongo/Interface/base.interface';

import { BaseRepository } from 'src/Mongo/repository/base.repository';

@Injectable()
export class BaseService {
  constructor(private readonly baseRepository: BaseRepository) {}

  async getAllBase(): Promise<Base[]> {
    return await this.baseRepository.getAllBase();
  }

  async getBaseByID(baseID: string): Promise<Base> {
    try {
      return await this.baseRepository.getBaseByID(baseID);
    } catch (e) {
      throw new BadRequestException('Nenhuma base encontrada com esse ID');
    }
  }

  async saveBase(newBase: BaseDTO): Promise<Base> {
    console.log('Recebido a base: ', newBase.name);
    return await this.baseRepository.saveBase(newBase);
  }

  async updateBase(baseID: string, newBase: BaseDTO): Promise<Base> {
    try {
      const baseUpdated = await this.baseRepository.updateBase(baseID, newBase);
      console.log('Base atualizada: ', baseUpdated.name);
      return baseUpdated;
    } catch (e) {
      throw new BadRequestException('Nenhuma base encontrada com esse ID');
    }
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
