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
import { BaseService } from 'src/services/base/base.service';

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

  //Faz o upload de arquivos e converte em JSON para salvar no banco de dados
  @Post('/files')
  @UseInterceptors(
    FilesInterceptor('files', undefined, {
      fileFilter: CSVFilter,
    }),
  )
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    return await this.baseService.uploadFiles(files);
  }
}
