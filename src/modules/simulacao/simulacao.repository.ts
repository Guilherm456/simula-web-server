import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Base } from '@modules/base/interfaces/base.interface';
import { Pagination } from 'src/interfaces';
import { buildFilter } from 'src/middleware/filter';
import { FilterDTO } from '../../interfaces/query.interface';
import {
  Simulacao,
  SimulacaoDocument,
  StatusEnum,
} from './interface/simulacao.interface';

@Injectable()
export class SimulacaoRepository {
  constructor(
    @InjectModel('simulacao')
    private readonly simulacaoModel: Model<SimulacaoDocument>,
  ) {}

  async replaceColumn(
    simulacaoID: string,
    nameColumn: string,
    newValue: any,
  ): Promise<Simulacao> {
    return await this.simulacaoModel
      .findOneAndUpdate(
        { _id: simulacaoID },
        {
          [nameColumn]: newValue,
        },
      )
      .exec();
  }

  async saveSimulations(
    simulacao: Omit<Simulacao, 'createdAt' | 'status' | 'active'>,
    base: Base,
  ): Promise<Simulacao> {
    const savedSimulacao = new this.simulacaoModel({
      ...simulacao,
      base,
      status: StatusEnum.PENDING,
    });
    return await savedSimulacao.save();
  }

  async existsSimulations(simulacaoID: string): Promise<boolean> {
    const simulacao = await this.simulacaoModel
      .exists({ _id: simulacaoID })
      .exec();

    return !!simulacao;
  }

  async getSimulations({ limit = 10, offset = 0, ...query }: FilterDTO = {}) {
    const filter = buildFilter(query);
    const [content, totalElements] = await Promise.all([
      this.simulacaoModel
        .find({ __v: false, ...filter })
        .skip(offset * limit)
        .limit(limit)
        .sort({ name: +1 })
        .exec(),
      this.simulacaoModel
        .countDocuments({
          active: true,
          ...filter,
        })
        .exec(),
    ]);

    const totalPages = Math.ceil(totalElements / limit);
    const hasNext = offset + 1 < totalPages;
    return {
      content,
      totalElements,
      totalPages,
      hasNext,
    } as Pagination<Simulacao>;
  }

  async getSimulationsByID(ID: string): Promise<Simulacao> {
    return await this.simulacaoModel
      .findById(ID, { __v: false })
      .populate('base', { parameters: false })
      .lean()
      .exec();
  }

  async getSimulationsByBaseID(baseID: string): Promise<Simulacao[]> {
    return await this.simulacaoModel
      .find({ 'base._id': baseID }, { __v: false })
      .exec();
  }

  async updateSimulations(
    simulacaoID: string,
    newSimulacao: Simulacao,
  ): Promise<Simulacao> {
    return await this.simulacaoModel
      .findOneAndReplace({ _id: simulacaoID }, newSimulacao, {
        new: true,
      })
      .exec();
  }

  async deleteSimulations(simulacaoID: string): Promise<Simulacao> {
    return await this.replaceColumn(simulacaoID, 'active', false);
  }
}
