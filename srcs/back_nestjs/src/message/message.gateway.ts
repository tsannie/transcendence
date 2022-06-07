import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WsResponse} from "@nestjs/websockets";
import { v4 as uuidv4 } from 'uuid'
import { from, map, Observable } from "rxjs";
import { Socket, Server, Namespace } from "socket.io";
import { Repository } from "typeorm";
import { MessageEntity } from "./models/message.entity";
import { IMessage } from "./models/message.interface";

// cree une websocket sur le port par defaut
@WebSocketGateway({
  namespace: 'message',
    cors: {
        origin: '*',
    }
})
export class MessageGateway /* implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect */{

  @WebSocketServer()
  server: Namespace;
  private readonly logger: Logger = new Logger('messageGateway');

  @SubscribeMessage('message')
    handleEvent(
    @MessageBody() data: string)
    : string {
    this.logger.log(data)
    let newUuid = uuidv4();
    const newMessage: IMessage = {
      id: newUuid,
      content: data
    }
    this.add(newMessage);
    this.server.emit('message', data);
    return (data);
  }

  /* afterInit() {
    this.logger.log('Init')
  }

  handleConnection(client: Socket) {
    const socket = this.server.sockets;

    this.logger.log(`Client connected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${socket.size}`);

    this.server.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const socket = this.server.sockets;

    this.logger.log(`Client disconnected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${socket.size}`);
  }
 */
  @InjectRepository(MessageEntity)
  private allMessages: Repository<MessageEntity>

  add(message: IMessage) : Observable<IMessage>{
    return (from(this.allMessages.save(message)));
  }
  getAllMessages(): Observable<IMessage[]> {
		return from(this.allMessages.find());
	}
}