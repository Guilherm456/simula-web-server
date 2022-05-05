import { Module } from '@nestjs/common';
import { LoggerServer } from 'src/loggerServer';
import { AppGateway } from './app.gateway';

@Module({ providers: [AppGateway, LoggerServer] })
export class AppServerModule {}
