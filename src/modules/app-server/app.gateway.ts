import { Injectable } from '@nestjs/common';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { existsSync, openSync, readFileSync, watchFile } from 'fs';

import { Server, Socket } from 'socket.io';
import { LoggerServer } from 'src/loggerServer';

@WebSocketGateway({ cors: '*' })
@Injectable()
export class AppGateway implements OnGatewayInit {
  private file: string;

  constructor(private logger: LoggerServer) {}

  @WebSocketServer()
  private server: Server;
  afterInit() {
    this.file = __dirname + '/../../log.txt';

    //Vai verificar se existe o arquivo
    //Se não existir, cria um
    if (!existsSync(this.file)) {
      openSync(this.file, 'w');
    }
    try {
      watchFile(this.file, (curr, prev) => {
        this.server.emit('log', this.handleLog());
      });
    } catch (e) {
      this.logger.error('Algum erro ocorreu no sistema de arquivos do log');
    }
  }

  @SubscribeMessage('log')
  handleLog(client?: Socket): string[] {
    const lines = readFileSync(this.file, 'utf8').split('\n');

    return lines;
  }
}
