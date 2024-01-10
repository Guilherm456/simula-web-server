import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Connection, Model } from 'mongoose';

import { Output } from '@modules/saida/interface/output.interface';
import { LoggerServer } from 'src/loggerServer';
import { Saida } from './saida.interface';

@Injectable()
export class SaidaRepository {
  private gridFSBucket: GridFSBucket;

  constructor(
    @InjectModel('saida') private readonly saidaModel: Model<Saida>,
    private readonly logger: LoggerServer,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.gridFSBucket = new GridFSBucket(this.connection.db as any, {
      bucketName: 'saidas',
    });
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

  async getAllSaidas(): Promise<Saida[]> {
    try {
      return await this.saidaModel.find().exec();
    } catch (error) {
      this.logger.error(`Failed to get all saidas: ${error.message}`);
      throw error;
    }
  }

  async getSaidaByID(id: string): Promise<Saida> {
    try {
      const saida = await this.saidaModel.findById(id).exec();
      if (saida && saida.data) {
        const fileData = await this.readFile(saida.data.toString());
        saida.data = fileData; // Replace the file ID with the actual data from GridFS
      }
      return saida;
    } catch (error) {
      this.logger.error(`Failed to get saida by ID: ${error.message}`);
      throw error;
    }
  }

  async getSaidasBySimulationID(simulationId: string): Promise<Saida[]> {
    try {
      const saidas = await this.saidaModel.find({ simulationId }).exec();
      for (const saida of saidas) {
        if (saida && saida.data) {
          const fileData = await this.readFile(saida.data.toString());
          saida.data = fileData;
        }
      }
      return saidas;
    } catch (error) {
      this.logger.error(
        `Failed to get saidas by simulationId: ${error.message}`,
      );
      throw error;
    }
  }

  async saveSaida(output: Output): Promise<Saida> {
    const newSaida = new this.saidaModel(output);
    return await newSaida.save();
  }

  // async updateSaida(id: string, newData: object): Promise<Saida> {
  //   try {
  //     const fileId = await this.uploadFile(newData);
  //     return await this.saidaModel
  //       .findByIdAndUpdate(
  //         id,
  //         { data: fileId },
  //         {
  //           new: true,
  //         },
  //       )
  //       .exec();
  //   } catch (error) {
  //     this.logger.error(`Failed to update saida: ${error.message}`);
  //     throw error;
  //   }
  // }

  async deleteSaida(id: string): Promise<Saida> {
    return (await this.saidaModel.findOneAndDelete({ _id: id }).exec()).value;
  }
}
