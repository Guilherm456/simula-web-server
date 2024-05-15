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

@WebSocketGateway({
  path: '/log',
  transports: ['websocket'],
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
})
@Injectable()
export class AppGateway implements OnGatewayInit {
  private file: string;
  private lastLineSent = 0;
  private totalLines = 0;

  constructor(private logger: LoggerServer) {}

  @WebSocketServer()
  private server: Server;
  afterInit() {
    this.file = __dirname + '/../../log.json';

    //Vai verificar se existe o arquivo
    //Se não existir, cria um
    if (!existsSync(this.file)) {
      openSync(this.file, 'w');
    }
    try {
      watchFile(this.file, () => {
        this.server.emit(
          'newLog',
          this.handleLog({ isFirstConnection: false }),
        );
      });
    } catch (e) {
      this.logger.error('Algum erro ocorreu no sistema de arquivos do log');
    }
  }

  @SubscribeMessage('log')
  handleSendLog(
    client: Socket,
    payload: { isFirstConnection: boolean },
  ): object[] {
    return this.handleLog(payload);
  }

  handleLog(payload: { isFirstConnection: boolean }): object[] {
    const lines = readFileSync(this.file).toString().split('\n');

    if (lines.length < this.totalLines) {
      // Se o número de linhas diminuiu, o arquivo foi rotacionado
      this.lastLineSent = 0;
    }
    this.totalLines = lines.length;

    let newLines = [];
    if (payload.isFirstConnection) {
      // Se for a primeira conexão do cliente, enviar todas as linhas
      newLines = lines.filter((line) => line);
    } else {
      // Senão, enviar apenas as novas linhas
      newLines = lines.slice(this.lastLineSent).filter((line) => line);
    }
    this.lastLineSent = lines.length - 1;

    return newLines.map((line) => JSON.parse(line)).reverse();
  }
}
