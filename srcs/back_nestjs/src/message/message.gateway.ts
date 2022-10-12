import { Get, Injectable, Logger, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsResponse,
} from '@nestjs/websockets';
import { Socket, Server, Namespace } from 'socket.io';
import { MessageService } from './service/message.service';
import { UserService } from 'src/user/service/user.service';
import { DmService } from 'src/dm/service/dm.service';
import { IMessage } from './models/message.interface';
import { UserEntity } from 'src/user/models/user.entity';


// cree une websocket sur le port par defaut
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessageService,
    private userService: UserService,
  ) {}

  connectedClients: Map<string, UserEntity> = new Map();

  private readonly logger: Logger = new Logger('messageGateway');

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Init');
  }

  // all clients connect to the server
  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      let userId = client.handshake.query.userId;
      let user: UserEntity;
      //console.log("userId = ", userId);
      if (typeof userId === 'string') {
        user = await this.userService.findById(parseInt(userId));
      }
      if (!user) {
        return this.disconnect(client);
      }
      else {
        this.connectedClients.set(client.id, user);
        //console.log("map clients = ", this.connectedClients);
      }
    }
    catch {
      return this.disconnect(client);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // remove client from the map
    this.connectedClients.delete(client.id);
    //console.log("map clients = ", this.connectedClients);
    client.disconnect();
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage('message')
  addMessage(@MessageBody() data: IMessage, @ConnectedSocket() client: Socket) {
    //): Observable<IMessage> {
    this.logger.log("client id = ", client.id);

    if (data.isDm === true) {
      this.messageService.addMessagetoDm(data);
    } else {
      this.messageService.addMessagetoChannel(data);
    }
    console.log("data message = ", data);

    // emit to all clients
    //this.server.emit('message', data);

    // parcourir tous mes clients connectés et envoyer le message uniquement a l'id du target
    console.log("map clients = ", this.connectedClients);
    this.connectedClients.forEach((value, key) => {
      console.log("data.target = ", data.target);
      if (value.username === data.target || value.username === data.author) {
        // get all message between the 2 users
        //this.messageService.loadMessages()
        //this.dmService.
        this.server.to(key).emit('message', data);
      }
    });
    //this.server.emit('message', data);
    console.log("BEFORE SEND TO CLIENT");
    //this.server.to(client.id).emit('message', data);
  }
}
