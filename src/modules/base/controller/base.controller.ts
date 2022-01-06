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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { BaseDTO } from 'src/DTO/base.DTO';
import { Base } from 'src/Mongo/Interface/base.interface';
import { StructuresInterface } from 'src/Mongo/Interface/structures.interface';

import { BaseService } from 'src/modules/base/service/base.service';

//Filtro para verificar se é arquivos CSV
const CSVFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  //Verifica se é arquivos CSV, caso não seja, aponta o erro ao usuário
  if (file.mimetype !== 'text/csv')
    return callback(
      new HttpException('Only CSV files are allowed!', HttpStatus.BAD_REQUEST),
      false,
    );

  //Caso seja, retorna nenhum erro (permitindo o arquivo)
  return callback(null, true);
};

@Controller('base')
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Get()
  async getAllBase(): Promise<Base[]> {
    return await this.baseService.getAllBase();
  }

  @Get('/structures')
  getAllStructures(): StructuresInterface[] {
    return this.baseService.getAllStructures();
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
      // fileFilter: CSVFilter,
    }),
  )
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

  @Delete('/:baseID')
  async deleteBase(@Param('baseID') baseID: string): Promise<Base> {
    return await this.baseService.deleteBase(baseID);
  }
}
