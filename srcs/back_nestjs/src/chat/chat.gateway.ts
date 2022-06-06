import { Injectable, Logger } from "@nestjs/common";
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
import { from, map, Observable } from "rxjs";
import { Socket, Server, Namespace } from "socket.io";

// cree une websocket sur le port par defaut
@WebSocketGateway({
  namespace: 'chat',
    cors: {
        origin: '*',
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() io: Namespace;
  private readonly logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('events')
    handleEvent(
    @MessageBody() data: string)
    : string {
    this.logger.log(data)
    return (data);
  }

  afterInit() {
    this.logger.log('Init')
  }

  handleConnection(client: Socket) {
    const socket = this.io.sockets;

    this.logger.log(`Client connected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${socket.size}`);

    this.io.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const socket = this.io.sockets;

    this.logger.log(`Client disconnected: ${client.id}`);
    this.logger.debug(`Number of connected sockets: ${socket.size}`);
  }
}