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
import { Socket } from "dgram";
import { from, map, Observable } from "rxjs";
import { Server } from "socket.io";

const newlog: Logger = new Logger();

newlog.log('abricot')

// cree une websocket sur le port par defaut
@WebSocketGateway({
    cors: {
        origin: '*'
    },
})
export class ChatGateway {

  private readonly logger = new Logger()
  /* @WebSocketServer()
  server: Server; */

  @SubscribeMessage('events')
  handleEvent(client: Socket, data: string): string {
  /* handleEvent(
    @MessageBody() data: string)
  : string { */
    this.logger.log('bien recu !');
    return data;
  }

  /* @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
      return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
      return data;
  } */
}