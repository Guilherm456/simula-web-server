import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Output } from '@modules/saida/interface/output.interface';
import { FilterDTO } from '@types';
import { buildFilter } from 'src/middleware/filter';
import { OutputDocument } from './saida.interface';

@Injectable()
export class SaidaRepository {
  constructor(
    @InjectModel('saida') private readonly outputModel: Model<OutputDocument>,
  ) {}

  async getAllSaidas({ offset, limit, ...query }: FilterDTO = {}) {
    const filter = buildFilter(query);
    const [content, totalElements] = await Promise.all([
      this.outputModel.find(filter).skip(offset).limit(limit).exec(),
      this.outputModel.countDocuments(filter).exec(),
    ]);

    return {
      content,
      totalElements,
      totalPages: Math.ceil(totalElements / limit),
      hasNext: totalElements > offset + limit,
    };
  }

  async getSaidaByID(id: string) {
    return await this.outputModel.findById(id).exec();
  }

  async saveOutput(output: Output) {
    const saida = new this.outputModel(output);
    return await saida.save();
  }

  async updateOutput(id: string, output: Output) {
    return await this.outputModel
      .findOneAndReplace(
        {
          _id: id,
        },
        output,
        { new: true },
      )
      .exec();
  }

  async getSaidaBySimulationID(simulationID: string) {
    return await this.outputModel.findOne({ simulation: simulationID }).exec();
  }

  async deleteSaida(id: string) {
    const ouput = await this.outputModel.findOneAndDelete({ _id: id }).exec();

    return ouput.value;
  }

  async alreadyExists(id: string): Promise<boolean> {
    const ouput = await this.outputModel.exists({ _id: id }).exec();
    return !!ouput;
  }
}
