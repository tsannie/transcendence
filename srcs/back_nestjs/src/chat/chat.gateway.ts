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
import { Socket, Server } from "socket.io";

// cree une websocket sur le port par defaut
@WebSocketGateway({
  namespace: 'chat',
    cors: {
        origin: '*',
    }
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('events')
    handleEvent(
    @MessageBody() data: string)
    : string {
    this.logger.log(data)
    //this.server.emit('msgToClient', data);
    return (data);
  }

  afterInit(server: Server) {
    console.log("Init")
    //server.send('salut les clients')
    this.logger.log('Init')
  }

  handleConnection(client: Socket, ...args: any[]) {
    //throw new Error('Method not implemented');
    console.log("connected")
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    //throw new Error('Method not implemented');
    console.log("disconnected")
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}