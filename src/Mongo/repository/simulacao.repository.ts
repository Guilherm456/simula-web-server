import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SimulacaoDTO } from 'src/DTO/simulacao.dto';
import { Base } from '../Interface/base.interface';
import { FilterDTO } from '../Interface/query.interface';
import {
  DatasProps,
  Simulacao,
  StatusEnum,
} from '../Interface/simulacao.interface';

@Injectable()
export class SimulacaoRepository {
  constructor(
    @InjectModel('simulacao') private readonly simulacaoModel: Model<Simulacao>,
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

  async saveSimulacao(simulacao: SimulacaoDTO, base: Base): Promise<Simulacao> {
    const savedSimulacao = new this.simulacaoModel({
      ...simulacao,
      base: base,
      status: StatusEnum.PENDING,
    });
    return await savedSimulacao.save();
  }

  async getSimulations(query?: FilterDTO): Promise<Simulacao[]> {
    return await this.simulacaoModel
      .find({ __v: false, ...query })
      .sort({ name: +1 })
      .exec();
  }

  async getSimulacoesByStatus(comparation: StatusEnum): Promise<Simulacao[]> {
    return await this.simulacaoModel
      .find({ status: comparation }, { __v: false })
      .sort({ name: +1 })
      .exec();
  }
  async getSimulacaoByID(ID: string): Promise<Simulacao> {
    return await this.simulacaoModel.findById(ID, { __v: false }).exec();
  }

  async getSimulacoesByBaseID(baseID: string): Promise<Simulacao[]> {
    return await this.simulacaoModel
      .find({ 'base._id': baseID }, { __v: false })
      .exec();
  }

  async executeSimulacao(
    simulacaoID: string,
    data: DatasProps[],
  ): Promise<Simulacao> {
    return await this.simulacaoModel
      .findOneAndUpdate(
        { _id: simulacaoID },
        {
          result: data,
          progress: 100,
        },
      )
      .exec();
  }

  async updateSimulacao(
    simulacaoID: string,
    newSimulacao: SimulacaoDTO,
  ): Promise<Simulacao> {
    return await this.simulacaoModel
      .findOneAndReplace({ _id: simulacaoID }, newSimulacao)
      .exec();
  }

  async deleteSimulacao(simulacaoID: string): Promise<Simulacao> {
    return await this.simulacaoModel.findByIdAndRemove(simulacaoID).exec();
  }
}
