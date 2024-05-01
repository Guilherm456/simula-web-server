import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilterDTO, Pagination } from '@types';
import { buildFilter } from 'src/middleware/filter';
import { Base, BaseDocument } from './interfaces/base.interface';

@Injectable()
export class BaseRepository {
  constructor(
    @InjectModel('base') private readonly baseModel: Model<BaseDocument>,
  ) {}

  async getBases({ limit = 10, offset = 0, ...query }: FilterDTO = {}) {
    const filter = buildFilter(query);

    const [content, totalElements] = await Promise.all([
      this.baseModel
        .find({
          active: true,
          __v: false,
          ...filter,
        })
        .populate('type', 'name _id')
        .skip(offset * limit)
        .limit(limit)
        .sort({ name: +1 })
        .exec(),
      this.baseModel.countDocuments(query).exec(),
    ]);

    const totalPages = Math.ceil(totalElements / limit);
    const hasNext = offset + 1 < totalPages;
    return {
      content,
      totalElements,
      totalPages,
      hasNext,
    } as Pagination<Base>;
  }

  async getBaseByID(baseID: string): Promise<Base> {
    const base = await this.baseModel
      .findById(baseID, { __v: false })
      .populate('type')
      .lean()
      .exec();
    return base;
  }

  async saveBase(baseDTO: Omit<Base, 'createdAt' | 'active'>): Promise<Base> {
    const base = new this.baseModel(baseDTO);
    return await base.save();
  }

  async updateBase(baseID: string, newBase: Base): Promise<Base> {
    return await this.baseModel
      .findOneAndReplace({ _id: baseID }, newBase, {
        new: true,
      })
      .exec();
  }

  async replaceColumn(
    baseID: string,
    nameColumn: string,
    newValue: any,
  ): Promise<Base> {
    return await this.baseModel.findOneAndUpdate(
      { _id: baseID },
      {
        [nameColumn]: newValue,
        updatedAt: new Date().toISOString(),
      },
    );
  }
  async deleteBase(baseID: string): Promise<Base> {
    return await this.replaceColumn(baseID, 'active', false);
  }
}
