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
  namespace: 'message',
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
    @MessageBody() data: string)
    : string {
    this.logger.log(data)
    let newUuid = uuidv4();
    const newMessage: IMessage = {
      id: newUuid,
      content: data
    }
    //if (Object.keys(this.allMessages).length === 0) // join room if conversation started
      // join room
    this.add(newMessage);
    this.server.emit('message', data);
    return (data);
  }

  afterInit() {
    this.logger.log('Init')
  }

  handleConnection(client: Socket) {
    const socket = this.server.sockets;

    this.logger.log(`Client connected: ${client.id}`);
    //this.logg er.debug(`Number of connected sockets: ${socket.size}`);
    this.connectedClients.push(client);
    this.server.emit('hello', `from ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const socket = this.server.sockets;

    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients = this.connectedClients.filter( (connectedClient) => {
      return connectedClient !== client.id
    })
    //this.logger.debug(`Number of connected sockets: ${socket.size}`);
  }

  add(message: IMessage) : Observable<IMessage>{
    return (from(this.allMessages.save(message)));
  }
  getAllMessages(): Observable<IMessage[]> {
		return from(this.allMessages.find());
	}

  // Quand tu doubles cliques sur un utilisateur, cela va cree une room pour pouvoir le dm

  @SubscribeMessage('createRoom')
    createRoom(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket) {
    const socket = this.server.sockets;

    // client rejoint la room
    client.join(data);

    // parcourt mon tableau de client et affiche les id des clients dispo !
    /* this.connectedClients.forEach( (connectedClient) => {
      console.log(connectedClient.id);
    }); */
    //client.to(data).emit('createRoom', {room: data});
    //client.broadcast.emit('createRoom')
    this.logger.log(`Room created with client: ${client.id}`);
  }
}