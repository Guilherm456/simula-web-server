import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { BaseService } from 'src/modules/base/service/base.service';

import { CacheInterceptor } from '@nestjs/cache-manager';
import { MiddlewareRequest } from '@types';
import { FilterDTO } from 'src/interfaces/query.interface';
import { Roles } from 'src/roles';
import { BaseDTO } from '../interfaces/base.dto';
import { Base } from '../interfaces/base.interface';

@Controller('base')
@UseInterceptors(CacheInterceptor)
export class BaseController {
  constructor(private readonly baseService: BaseService) {}

  @Get()
  @Roles('guest')
  async getAllBase(@Query() query: FilterDTO) {
    return await this.baseService.getBases(query);
  }

  //Verifica alguma base pelo ID
  @Get('/:baseID')
  @Roles('guest')
  async getBaseByID(@Param('baseID') baseID: string): Promise<Base> {
    return await this.baseService.getBaseByID(baseID);
  }

  //Salva a base
  @Post('/:structureID')
  @Roles('user')
  async saveBase(
    @Body() base: BaseDTO,
    @Param('structureID') structureID: string,
    @Req() req: MiddlewareRequest,
  ): Promise<Base> {
    return await this.baseService.saveBase(base, structureID, req.user.id);
  }

  //Faz o upload de arquivos e converte em JSON para salvar no banco de dados
  @Post('/files/:structureID/:name')
  @Roles('user')
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
    @Param('structureID') structureID: string,
    @Param('name') name: string,
    @Req() req: MiddlewareRequest,
  ) {
    return await this.baseService.uploadFiles(
      files,
      structureID,
      name,
      req.user.id,
    );
  }

  //Atualiza a base
  @Put('/:baseID')
  @Roles('user')
  async updateBase(
    @Param('baseID') baseID: string,
    @Body() base: BaseDTO,
    @Req() req: MiddlewareRequest,
  ): Promise<Base> {
    return await this.baseService.updateBase(baseID, base, req.user.id);
  }

  //Deleta a base
  @Delete('/:baseID')
  @Roles('user')
  async deleteBase(
    @Param('baseID') baseID: string,
    @Req() req: MiddlewareRequest,
  ): Promise<Base> {
    return await this.baseService.deleteBase(baseID, req.user.id);
  }
}
