import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { BaseDTO } from 'src/DTO/base.dto';
import { BaseService } from 'src/modules/base/service/base.service';
import { Base } from 'src/Mongo/Interface/base.interface';
import {
  StatesInterface,
  StructuresInterface,
} from 'src/Mongo/Interface/structures.interface';

import { LoggerServer } from 'src/loggerServer';
import { FilterDTO } from 'src/Mongo/Interface/query.interface';

@Controller('base')
export class BaseController {
  constructor(
    private readonly baseService: BaseService,
    private readonly logger: LoggerServer,
  ) {}

  @Get()
  async getAllBase(@Query() query: FilterDTO): Promise<Base[]> {
    return await this.baseService.getBases(query);
  }

  //Retorna todas as estruturas
  @Get('/structures')
  getAllStructures(): StructuresInterface[] {
    return this.baseService.getAllStructures();
  }

  @Get('/:baseID/structures')
  async getStructureFromBase(
    @Param('baseID') baseID: string,
  ): Promise<StructuresInterface> {
    return this.baseService.getStructureByID(baseID);
  }

  //Responsável por buscar uma estrutura pelo nome da mesma
  @Get('/structures/:nameStructure')
  getStructureByName(
    @Param('nameStructure') nameStructure: string,
  ): StructuresInterface | [] {
    return this.baseService.getStructureByName(nameStructure);
  }

  @Get('/:baseID/states')
  async getStatesByBase(
    @Param('baseID') baseID: string,
  ): Promise<StatesInterface> {
    return this.baseService.getStatesByBase(baseID);
  }

  //Repassa os estados que os agentes podem ter em uma determinada estrutura
  @Get('/structures/:nameStructure/states')
  getStatesByStructure(
    @Param('nameStructure') nameStructure: string,
  ): StatesInterface {
    return this.baseService.getStatesByStructure(nameStructure);
  }

  //Verifica alguma base pelo ID
  @Get('/:baseID')
  async getBaseByID(@Param('baseID') baseID: string): Promise<Base> {
    return await this.baseService.getBaseByID(baseID);
  }

  //Salva a base
  @Post()
  async saveBase(@Body() base: BaseDTO): Promise<Base> {
    return await this.baseService.saveBase(base);
  }

  //Faz o upload de arquivos e converte em JSON para salvar no banco de dados
  @Post('/files/:structure/:name')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: (req, file, callback) => {
        //Verifica se é arquivos CSV, caso não seja, aponta o erro ao usuário
        if (file.mimetype !== 'text/csv')
          return callback(
            new HttpException(
              'Apenas arquivos CSV são permitidos!',
              HttpStatus.BAD_REQUEST,
            ),
            true,
          );

        //Caso seja, retorna nenhum erro (permitindo o arquivo)
        return callback(null, true);
      },
    }),
  )

  //Faz o upload de arquivos e converte em JSON para salvar no banco de dados
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('structure') structure: string,
    @Param('name') name: string,
  ) {
    return await this.baseService.uploadFiles(files, structure, name);
  }

  //Atualiza a base
  @Patch('/:baseID')
  async updateBase(
    @Param('baseID') baseID: string,
    @Body() base: BaseDTO,
  ): Promise<Base> {
    return await this.baseService.updateBase(baseID, base);
  }

  //Deleta a base
  @Delete('/:baseID')
  async deleteBase(@Param('baseID') baseID: string): Promise<Base> {
    return await this.baseService.deleteBase(baseID);
  }
}
