import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { GridFSBucket, ObjectId } from 'mongodb';
import { SimulacaoDTO } from 'src/DTO/simulacao.dto';
import { Readable } from 'stream';
import { Base } from '../Interface/base.interface';
import { FilterDTO } from '../Interface/query.interface';
import { Simulacao, StatusEnum } from '../Interface/simulacao.interface';

@Injectable()
export class SimulacaoRepository {
  private gridFSBucket: GridFSBucket;
  constructor(
    @InjectModel('simulacao') private readonly simulacaoModel: Model<Simulacao>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.gridFSBucket = new GridFSBucket(this.connection.db as any, {
      bucketName: 'parameters',
    });
  }

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
    simulacao: SimulacaoDTO,
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

  async getSimulations(query?: FilterDTO): Promise<Simulacao[]> {
    return await this.simulacaoModel
      .find({ __v: false, ...query })
      .sort({ name: +1 })
      .exec();
  }

  async getSimulationsByStatus(comparation: StatusEnum): Promise<Simulacao[]> {
    return await this.simulacaoModel
      .find({ status: comparation }, { __v: false })
      .sort({ name: +1 })
      .exec();
  }

  async readFile(id: string): Promise<any> {
    const stream = this.gridFSBucket.openDownloadStream(new ObjectId(id));

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return JSON.parse(buffer.toString('utf-8'));
  }

  async uploadFile(parameters: object): Promise<string> {
    const uploadStream = this.gridFSBucket.openUploadStream(
      `parameters-${Date.now()}.json`,
    );

    const stream = new Readable();
    stream.push(JSON.stringify(parameters));
    stream.push(null);

    stream.pipe(uploadStream);
    return uploadStream.id.toString() as string;
  }

  async getSimulationsByID(ID: string): Promise<Simulacao> {
    return await this.simulacaoModel.findById(ID, { __v: false }).exec();
  }

  async getSimulationsByBaseID(baseID: string): Promise<Simulacao[]> {
    return await this.simulacaoModel
      .find({ 'base._id': baseID }, { __v: false })
      .exec();
  }

  async updateSimulations(
    simulacaoID: string,
    newSimulacao: SimulacaoDTO,
  ): Promise<Simulacao> {
    return await this.simulacaoModel
      .findOneAndReplace({ _id: simulacaoID }, newSimulacao)
      .exec();
  }

  async deleteSimulations(simulacaoID: string): Promise<Simulacao> {
    return await this.simulacaoModel.findByIdAndRemove(simulacaoID).exec();
  }
}
