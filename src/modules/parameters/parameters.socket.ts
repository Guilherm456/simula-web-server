import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Queue } from 'bull';
import { Server, Socket } from 'socket.io';
import { PayloadParameters } from './interfaces/parameters';
import { ParametersService } from './services/parameters.service';

@WebSocketGateway({
  cors: `${process.env.CORS_ORIGIN}`,
  path: '/edit-parameters',
})
@Injectable()
export class ParametersSocket {
  constructor(
    private readonly parametersService: ParametersService,
    @InjectQueue('editParameters')
    private readonly editParametersQueue: Queue<PayloadParameters>,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('edit')
  async handleEdit(client: Socket, payload: PayloadParameters): Promise<void> {
    const { id, op, details, timestamp } = payload;
    const queue = await this.editParametersQueue.add({
      id,
      op,
      details,
      timestamp,
    });

    client.emit('edit', queue.id);
  }
}
