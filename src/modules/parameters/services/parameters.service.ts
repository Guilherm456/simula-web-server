import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';
import { ParametersRepository } from '../repository/parameter.repository';

@Injectable()
export class ParametersService {
  constructor(
    private readonly parametersRepository: ParametersRepository,
    private readonly logger: LoggerServer,
  ) {}

  async getParametersByID(id: string): Promise<object> {
    try {
      return await this.parametersRepository.readFile(id);
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

  async uploadAllParameters(parameters: object[]): Promise<string[]> {}
}
