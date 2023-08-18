import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Readable } from 'stream';
import { GridFSBucket, ObjectId } from 'mongodb';

import { LoggerServer } from 'src/loggerServer';
import { Saida } from '../Interface/saida.interface';

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

  async uploadFile(parameters: object): Promise<string> {
    const uploadStream = this.gridFSBucket.openUploadStream(
      `saidas-${Date.now()}.json`,
    );
    const stream = new Readable();
    stream.push(JSON.stringify(parameters));
    stream.push(null);
    stream.pipe(uploadStream);
    return uploadStream.id.toString() as string;
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

  async saveSaida(simulationId: string, data: object): Promise<Saida> {
    try {
      const fileId = await this.uploadFile(data);
      const saida = new this.saidaModel({
        simulationId,
        data: fileId // Store the GridFS file ID instead of raw data
      });
      return await saida.save();
    } catch (error) {
      this.logger.error(`Failed to save saida: ${error.message}`);
      throw error;
    }
  }

  async updateSaida(id: string, newData: object): Promise<Saida> {
    try {
      const fileId = await this.uploadFile(newData);
      return await this.saidaModel.findByIdAndUpdate(id, { data: fileId }, { new: true }).exec();
    } catch (error) {
      this.logger.error(`Failed to update saida: ${error.message}`);
      throw error;
    }
  }

  async deleteSaida(id: string): Promise<Saida> {
    try {
      return await this.saidaModel.findByIdAndDelete(id).exec();
    } catch (error) {
      this.logger.error(`Failed to delete saida: ${error.message}`);
      throw error;
    }
  }
}
