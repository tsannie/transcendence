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
import { Adapter } from "socket.io-adapter";

// cree une websocket sur le port par defaut
@WebSocketGateway({
  namespace: 'chat',
    cors: {
        origin: '*',
    }
})
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
		@InjectRepository(MessageEntity)
		private allMessages: Repository<MessageEntity>
	) {}

  connectedClients = [];
  private readonly logger: Logger = new Logger('messageGateway');

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
    addMessage(
    @MessageBody() data: IMessage,
    @ConnectedSocket() client: Socket)
    : void {
    this.logger.log(client.id);
    let newUuid = uuidv4();
    const newMessage: IMessage = { // message de base + uuid
      id: newUuid,
      room: data.room,
      author: data.author,
      content: data.content,
      time: data.time,
    }
    this.add(newMessage);
    //if (Object.keys(this.allMessages).length === 0) // join room if conversation started
      // join room
    client.to(newMessage.room).emit("message", newMessage);
  }

  afterInit() {
    this.logger.log('Init')
  }

  handleConnection(client: Socket) {
    const socket = this.server.sockets;

    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.push(client);
    this.server.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const socket = this.server.sockets;

    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients = this.connectedClients.filter( (connectedClient) => {
      return connectedClient !== client.id
    })
  }

  add(message: IMessage) : Observable<IMessage>{
    return (from(this.allMessages.save(message)));
  }
  getAllMessages(): Observable<IMessage[]> {
		return from(this.allMessages.find());
	}

  // Quand tu doubles cliques sur un utilisateur, cela va cree une room pour pouvoir le dm

  @SubscribeMessage('joinRoom')
    joinRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket) {
    client.join(data);

    // parcourt mon tableau de client et affiche les id des clients dispo !
    /* this.connectedClients.forEach( (connectedClient) => {
      console.log(connectedClient.id);
    }); */
    this.logger.log(`client ${client.id} join room ${data} `);
  }
}