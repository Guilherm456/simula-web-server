import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';

import { BaseCreateDTO } from '../interfaces/base.dto';

import { parse } from 'papaparse';
import { FilterDTO } from 'src/interfaces/query.interface';
import { ParametersService } from 'src/modules/parameters/services/parameters.service';
import { StructureService } from 'src/modules/structure/service/structure.service';
import { BaseRepository } from '../base.repository';
import { Base } from '../interfaces/base.interface';

@Injectable()
export class BaseService {
  constructor(
    private readonly baseRepository: BaseRepository,
    private readonly logger: LoggerServer,
    private readonly parametersService: ParametersService,
    @Inject(forwardRef(() => StructureService))
    private readonly structureService: StructureService,
  ) {}

  convertJSON(file: Express.Multer.File) {
    //Verifica o tamanho do arquivo, caso seja muito grande, será avisado no servidor
    if (file.size >= 10000000)
      this.logger.warn(
        `Arquivo grande, pode demorar mais que o normal. Tamanho: ${file.size} bytes aproximadamente | Nome: ${file.originalname}`,
      );

    return parse(file.buffer.toString('utf-8'), {
      delimiter: ';',
      dynamicTyping: true,
      header: true,
    }).data;
  }

  async uploadFiles(
    files: Array<Express.Multer.File>,
    structureID: string,
    name: string,
    userID: string,
  ) {
    if (files === undefined || files.length === 0) {
      this.logger.error('Enviado arquivos inválidos ou nenhum arquivo enviado');
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    const structureObject = await this.structureService.getByID(structureID);
    if (!structureObject)
      throw new HttpException(
        'Estrutura não encontrada',
        HttpStatus.BAD_REQUEST,
      );

    if (structureObject.lengthParams !== files.length)
      throw new HttpException(
        'Número de arquivos enviados é diferente que o necessário para esta simulação',
        HttpStatus.BAD_REQUEST,
      );

    this.logger.log(
      `Fazendo o upload dos arquivos e convertendo para JSON. Número de arquivos: ${files.length}`,
    );

    const structureFinal = {} as Base;
    structureFinal.name = name;
    structureFinal.type = structureID;
    structureFinal.user = userID;
    structureFinal.parameters = {};

    const parameters = structureObject.parameters;

    try {
      for (let i = 0; i < parameters.length; i++) {
        const param = parameters[i];

        if (param.subParameters.length === 0)
          structureFinal.parameters[param.name] = this.convertJSON(files[i]);
        else {
          for (const subParam of param.subParameters) {
            structureFinal.parameters[param.name][subParam.name] =
              this.convertJSON(files[i]);

            i++;
          }
        }
      }
    } catch (e) {
      throw new HttpException(
        'Erro ao converter os arquivos! Valide se os arquivos estão no formato correto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const parameters = await this.parametersService.uploadAllParameters(
        structureFinal.parameters,
      );
      return await this.baseRepository.saveBase({
        ...structureFinal,
        parameters,
      });
    } catch (e) {
      throw new HttpException(
        `Erro ao salvar a base ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBases(query: FilterDTO) {
    return await this.baseRepository.getBases(query);
  }

  async getBaseByID(baseID: string): Promise<Base> {
    const base = await this.baseRepository.getBaseByID(baseID);

    if (!base)
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );

    return base;
  }

  async saveBase(
    base: BaseCreateDTO,
    structureID: string,
    userID: string,
  ): Promise<Base> {
    const structure = await this.structureService.getByID(structureID);
    if (!structure)
      throw new HttpException(
        'Estrutura não encontrada',
        HttpStatus.BAD_REQUEST,
      );

    try {
      const parameters =
        await this.structureService.createParametersObject(structureID);

      const parametersObject =
        await this.parametersService.uploadAllParameters(parameters);

      return await this.baseRepository.saveBase({
        ...base,
        user: userID,
        type: structureID,
        parameters: parametersObject,
      });
    } catch (e) {
      this.logger.error(`Erro ao salvar a base! Erro: ${e}`);

      throw new HttpException(
        'Erro ao salvar base',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateBase(
    baseID: string,
    newBase: BaseCreateDTO,
    userID: string,
  ): Promise<Base> {
    const base = await this.baseRepository.getBaseByID(baseID);
    if (!base)
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );

    if (base.user?.toString() !== userID)
      throw new HttpException(
        'Você não tem permissão para editar essa base',
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const updatedBase = await this.baseRepository.updateBase(baseID, {
        ...base,
        ...newBase,
        updatedAt: new Date().toISOString(),
      });

      this.logger.warn(`Base atualizada: ${newBase.name}`);
      return updatedBase;
    } catch (e) {
      this.logger.error(`Erro ao atualizar a base! Erro: ${e}`);

      throw new HttpException(
        'Erro ao atualizar base',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteBase(baseID: string, userID: string): Promise<Base> {
    const base = await this.baseRepository.getBaseByID(baseID);

    if (!base)
      throw new HttpException(
        'Nenhuma base encontrada com esse ID',
        HttpStatus.NOT_FOUND,
      );

    if (base.user.toString() !== userID)
      throw new HttpException(
        'Você não tem permissão para deletar essa base',
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const baseDeleted = await this.baseRepository.deleteBase(baseID);

      this.logger.warn(`Base deletada: ${baseDeleted.name}`);
      return baseDeleted;
    } catch (e) {
      this.logger.error(`Erro ao deletar a base! Erro: ${e}`);
      throw new HttpException(
        'Algum erro ocorreu ao deletar a base',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
