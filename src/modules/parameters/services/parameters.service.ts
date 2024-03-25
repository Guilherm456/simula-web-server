import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FilterDTO, Pagination } from '@types';
import { Cache } from 'cache-manager';
import { LoggerServer } from 'src/loggerServer';
import { ParametersRepository } from '../repository/parameter.repository';
@Injectable()
export class ParametersService {
  constructor(
    private readonly parametersRepository: ParametersRepository,
    private readonly logger: LoggerServer,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  //Feito para remover a paginação
  async readFile(id: string): Promise<object[]> {
    try {
      const param = await this.parametersRepository.readFile(id);

      if (!param) throw new Error('Parâmetro não encontrado');

      return param;
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async getParametersByID(
    id: string,
    { limit = 100, offset = 0 }: FilterDTO = {},
  ): Promise<Pagination<object>> {
    try {
      const cachedParameters = await this.cacheManager.get(`parameters:${id}`);
      let param: object[];

      if (cachedParameters) {
        // Se existirem parâmetros no cache, use-os
        param = cachedParameters as object[];
      } else {
        // Se não, carregue do repositório
        param = await this.readFile(id);
        // E salve no cache
        await this.cacheManager.set(`parameters:${id}`, param);
      }

      return {
        content: param?.slice(offset * limit, offset * limit + limit),
        hasNext: param.length > offset * limit + limit,
        totalElements: param.length,
        totalPages: Math.ceil(param.length / limit),
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Parâmetro não encontrado',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllParameters(ids: object): Promise<object> {
    try {
      const keys = Object.keys(ids);
      const parameters = {};
      await Promise.all(
        keys.map(async (key) => {
          if (typeof ids[key] === 'string') {
            parameters[key] = await this.readFile(ids[key]);
          } else {
            parameters[key] = await this.getAllParameters(ids[key]);
          }
        }),
      );
      return parameters;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Erro ao buscar parâmetros');
    }
  }

  async uploadParameters(parameters: object): Promise<string> {
    try {
      return await this.parametersRepository.uploadJSON(parameters);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async uploadAllParameters(parameters: object): Promise<any> {
    const keys = Object.keys(parameters);
    const newParameters = parameters;

    console.debug(parameters, keys);

    try {
      await Promise.all(
        keys.map(async (key) => {
          if (Array.isArray(parameters[key])) {
            newParameters[key] = await this.uploadParameters(parameters[key]);
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
      throw new Error('Ocorreu algum erro ao salvar o arquivo');
    }
  }

  async duplicateParameters(id: string): Promise<string> {
    try {
      const parameters = await this.parametersRepository.readFile(id);
      return await this.uploadParameters(parameters);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
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
      throw new Error(error);
    }
  }

  async deleteParameters(id: string): Promise<void> {
    try {
      await this.parametersRepository.deleteFile(id);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async deleteAllParameters(ids: object): Promise<void> {
    try {
      const keys = Object.keys(ids);
      await Promise.all(
        keys.map(async (key) => {
          if (typeof ids[key] === 'string') {
            await this.deleteParameters(ids[key]);
          } else {
            await this.deleteAllParameters(ids[key]);
          }
        }),
      );
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }
  }

  async updateParameters(id: string, newParameters: object): Promise<string> {
    // Backup do arquivo antigo
    const oldParameters = await this.parametersRepository.readFile(id);
    if (!oldParameters) throw new Error('Parâmetro não encontrado');

    try {
      await this.parametersRepository.deleteFile(id);
    } catch (error) {
      this.logger.error(error);
      throw new Error(error);
    }

    try {
      // Tentativa de atualizar o arquivo
      return await this.parametersRepository.updateFile(id, newParameters);
    } catch (error) {
      // Em caso de falha, tentar reverter para o estado anterior
      this.logger.error('Falha na atualização, revertendo...', error);
      try {
        await this.parametersRepository.updateFile(id, oldParameters);
      } catch (revertError) {
        this.logger.error(
          'Falha ao reverter para o estado anterior',
          revertError,
        );
        throw new Error('Falha ao atualizar e ao reverter mudanças');
      }

      // Lançar o erro original após a reversão
      throw new Error(error);
    }
  }
}
