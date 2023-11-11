import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Connection, Model } from 'mongoose';

import { BaseDTO } from 'src/DTO/base.dto';
import { LoggerServer } from 'src/loggerServer';
import { Readable } from 'stream';
import { Base } from '../Interface/base.interface';
import { FilterDTO } from '../Interface/query.interface';
@Injectable()
export class BaseRepository {
  private gridFSBucket: GridFSBucket;

  constructor(
    @InjectModel('base') private readonly baseModel: Model<Base>,
    @InjectConnection() private readonly connection: Connection,
    private readonly logger: LoggerServer,
  ) {
    this.gridFSBucket = new GridFSBucket(this.connection.db as any, {
      bucketName: 'parameters',
    });
  }

  async getBases(query: FilterDTO): Promise<Base[]> {
    return await this.baseModel
      .find({ __v: false, ...query })
      .sort({ name: +1 })
      .exec();
  }

  async getBaseByID(baseID: string): Promise<Base> {
    const base = await this.baseModel.findById(baseID, { __v: false }).exec();
    delete base.parameters;
    return base;
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

  async saveBase(baseDTO: BaseDTO): Promise<Base> {
    const { parameters } = baseDTO;

    const parametersID = await this.uploadFile(parameters);

    delete baseDTO.parameters;
    const base = new this.baseModel({
      ...baseDTO,
      parametersID,
    });
    return await base.save();
  }

  async updateBase(
    baseID: string,
    newBase: BaseDTO,
    parameters: any,
  ): Promise<boolean> {
    await this.gridFSBucket.delete(new ObjectId(parameters));

    delete newBase.parameters;

    await this.baseModel
      .replaceOne({ _id: baseID }, newBase, {
        new: true,
      })
      .exec();

    return true;
  }

  async deleteBase(baseID: string): Promise<Base> {
    const base = await this.baseModel.findOneAndDelete({ _id: baseID }).exec();
    await this.gridFSBucket.delete(new ObjectId(base.parameters));
    return base;
  }
}
