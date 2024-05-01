import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { GridFSBucket, ObjectId } from 'mongodb';
import { Connection } from 'mongoose';
import { Readable } from 'stream';

@Injectable()
export class ParametersRepository {
  private gridFSBucket: GridFSBucket;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.gridFSBucket = new GridFSBucket(this.connection.db as any, {
      bucketName: 'parameters',
    });
  }

  async readFile(id: string): Promise<object[]> {
    const stream = this.gridFSBucket.openDownloadStream(new ObjectId(id));

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
    return JSON.parse(buffer.toString('utf-8'));
  }

  async uploadJSON(parameters: object): Promise<string> {
    const uploadStream = this.gridFSBucket.openUploadStream(
      `parameters-${randomUUID()}.json`,
    );

    const stream = new Readable();
    stream.push(JSON.stringify(parameters));
    stream.push(null);

    stream.pipe(uploadStream);
    return uploadStream.id.toString() as string;
  }

  async deleteFile(id: string): Promise<void> {
    await this.gridFSBucket.delete(new ObjectId(id));
  }

  async updateFile(id: string, parameters: object): Promise<string> {
    const uploadStream = this.gridFSBucket.openUploadStreamWithId(
      new ObjectId(id),
      `parameters-${id}.json`,
    );

    const stream = new Readable();
    stream.push(JSON.stringify(parameters));
    stream.push(null);

    stream.pipe(uploadStream);
    return uploadStream.id.toString() as string;
  }
}
