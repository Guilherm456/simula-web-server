import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseDTO } from 'src/DTO/base.DTO';
import { Base } from '../Interface/base.interface';

@Injectable()
export class BaseRepository {
  constructor(@InjectModel('base') private readonly baseModel: Model<Base>) {}

  async getAllBase(): Promise<Base[]> {
    return await this.baseModel
      .find({}, { __v: false })
      .sort({ name: +1 })
      .exec();
  }

  async getBaseByID(baseID: string): Promise<Base> {
    return await this.baseModel.findById(baseID, { __v: false }).exec();
  }

  async saveBase(newBase: BaseDTO): Promise<Base> {
    const savedBase = new this.baseModel(newBase);
    return await savedBase.save();
  }

  async updateBase(baseID: string, newBase: BaseDTO): Promise<Base> {
    return await this.baseModel.replaceOne({ _id: baseID }, newBase);
  }

  async deleteBase(baseID: string): Promise<Base> {
    return await this.baseModel.findOneAndDelete({ _id: baseID }).exec();
  }
}
