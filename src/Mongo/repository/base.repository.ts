import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

import { GridFSBucket } from 'mongodb';
import { BaseDTO } from 'src/DTO/base.dto';
import { LoggerServer } from 'src/loggerServer';
import { Base } from '../Interface/base.interface';

@Injectable()
export class BaseRepository {
  private readonly gridFSBucket: GridFSBucket;

  constructor(
    @InjectModel('base') private readonly baseModel: Model<Base>,
    private readonly logger: LoggerServer,

    @InjectConnection() private readonly connection: Connection,
  ) {
    //@ts-ignore
    this.gridFSBucket = new GridFSBucket(this.connection.db, {
      bucketName: 'parameters',
    });
  }

  async getAllBase(): Promise<Base[]> {
    return await this.baseModel
      .find({}, { __v: false })
      .sort({ name: +1 })
      .exec();
  }

  async getBaseByID(baseID: string): Promise<Base> {
    return await this.baseModel.findById(baseID, { __v: false }).exec();
  }

  async saveParametersToGridFS(
    parameters: any,
    nameBase: string,
  ): Promise<string[]> {
    const fileIds: string[] = [];

    for (const key in parameters) {
      const parameter = parameters[key];

      if (typeof parameter === 'object') {
        const parameterJSON = JSON.stringify(parameter);

        const uploadStream = this.gridFSBucket.openUploadStream(
          `${key}-${nameBase}.json`,
        );
        uploadStream.write(parameterJSON);
        uploadStream.end();

        fileIds.push(uploadStream.id.toString());
      }
    }

    return fileIds;
  }

  async saveBase(newBase: BaseDTO): Promise<Base> {
    const { parameters, ...baseData } = newBase;

    const parameterFileIds = await this.saveParametersToGridFS(
      parameters,
      baseData.name,
    );

    this.logger.log(
      `Salvando base de dados: ${baseData.name} ${JSON.stringify(
        parameterFileIds,
      )}`,
    );
    const base = new this.baseModel({
      ...baseData,
      parameterFileIds,
    });

    return await base.save();
  }

  async updateBase(baseID: string, newBase: BaseDTO): Promise<Base> {
    //@ts-ignore
    return await this.baseModel.replaceOne({ _id: baseID }, newBase);
  }

  async deleteBase(baseID: string): Promise<Base> {
    return await this.baseModel.findOneAndDelete({ _id: baseID }).exec();
  }
}
