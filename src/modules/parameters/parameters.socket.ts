import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Queue } from 'bull';
import { Server, Socket } from 'socket.io';
import { ParametersService } from './services/parameters.service';

interface PayloadParameters {
  id: string;
  /**
   * Operation
   * u: update
   * d: delete
   * a: add
   */
  op: 'u' | 'd' | 'a';

  details?: number[];

  parameters?: object;

  timestamp: number;
}

@Injectable()
@WebSocketGateway({})
export class ParametersSocket {
  constructor(
    private readonly parametersService: ParametersService,
    @InjectQueue('editParameters')
    private readonly editParametersQueue: Queue<PayloadParameters>,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('startEditing')
  async handleStartEditing(client: Socket, payload: any): Promise<void> {
    const { id } = payload;
    const parameters = await this.parametersService.getParametersByID(id);
    client.emit('parameters', parameters);
  }

  @SubscribeMessage('edit')
  async handleEdit(client: Socket, payload: PayloadParameters): Promise<void> {
    const { id, op, details, parameters, timestamp } = payload;
    const queue = await this.editParametersQueue.add({
      id,
      op,
      details,
      parameters,
      timestamp,
    });

    client.emit('edit', queue.id);
  }
}
