import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { LoggerServer } from 'src/loggerServer';
import { ParametersRepository } from '../repository/parameter.repository';
@Injectable()
export class ParametersService {
  constructor(
    private readonly parametersRepository: ParametersRepository,
    private readonly logger: LoggerServer,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectQueue('editParameters') private readonly queue: Queue,
  ) {}

  async getParametersByID(id: string): Promise<object> {
    try {
      return await this.parametersRepository.readFile(id);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async test(id: string) {
    await this.queue.add({
      id: 'teste',
      op: 'a',
      timestamp: id,
    });

    return await this.queue.getJobs(['active', 'waiting', 'delayed']);
  }

  async getAllParameters(ids: object): Promise<object> {
    try {
      const keys = Object.keys(ids);
      const parameters = {};
      await Promise.all(
        keys.map(async (key) => {
          parameters[key] = await this.getParametersByID(ids[key]);
        }),
      );
      return parameters;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadParameters(parameters: object): Promise<string> {
    try {
      return await this.parametersRepository.uploadJSON(parameters);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadAllParameters(parameters: object): Promise<any> {
    try {
      const keys = Object.keys(parameters);
      const newParameters = parameters;
      await Promise.all(
        keys.map(async (key) => {
          if (parameters[key]?.length) {
            const id = await this.uploadParameters(parameters[key]);
            newParameters[key] = id;
          } else {
            const subKeys = Object.keys(parameters[key]);
            await Promise.all(
              subKeys.map(async (subKey) => {
                const id = await this.uploadParameters(parameters[key][subKey]);
                newParameters[key][subKey] = id;
              }),
            );
          }
        }),
      );
      return newParameters;
    } catch (e) {
      throw new HttpException(
        'Ocorreu algum erro ao salvar o arquivo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async duplicateParameters(id: string): Promise<string> {
    try {
      const parameters = await this.getParametersByID(id);
      return await this.uploadParameters(parameters);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async duplicateAllParameters(ids: object): Promise<object> {
    try {
      const keys = Object.keys(ids);
      const newParameters = {};

      await Promise.all(
        keys.map(async (key) => {
          if (ids[key]?.length) {
            newParameters[key] = await this.duplicateParameters(ids[key]);
            return;
          } else {
            newParameters[key] = {};

            const subKeys = Object.keys(ids[key]);
            await Promise.all(
              subKeys.map(async (subKey) => {
                newParameters[key][subKey] = await this.duplicateParameters(
                  ids[key][subKey],
                );
              }),
            );
          }
        }),
      );
      return newParameters;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteParameters(id: string): Promise<void> {
    try {
      await this.parametersRepository.deleteFile(id);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAllParameters(ids: object): Promise<void> {
    try {
      const keys = Object.keys(ids);
      await Promise.all(
        keys.map(async (key) => await this.deleteParameters(ids[key])),
      );
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateParameters(id: string, parameters: object): Promise<string> {
    try {
      return await this.parametersRepository.updateFile(id, parameters);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
