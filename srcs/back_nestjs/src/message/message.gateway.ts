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
      console.log("userId = ", userId);
      if (typeof userId === 'string') {
        user = await this.userService.findById(parseInt(userId));
      }
      if (!user) {
        return this.disconnect(client);
      }
      else {
        // check if user is already connected
        console.log("map clients in connection = ", this.connectedClients);
        if (this.connectedClients.has(client.id)) {
          this.logger.log(`Client already connected: ${client.id}`);
          return this.disconnect(client);
        }
        this.connectedClients.set(client.id, user);
        //console.log("map clients = ", this.connectedClients);
      }
    }
    catch {
      return this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    this.connectedClients.delete(client.id);
    this.connectedClients.clear();
    //console.log("map clients = ", this.connectedClients);
    client.disconnect();
  }

  private disconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.connectedClients.clear();
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

    // parcourir tous mes clients connectés et envoyer le message uniquement a l'id du target
    console.log("map clients = ", this.connectedClients);
    if (data.isDm === true) {
      this.connectedClients.forEach((value, key) => {
        console.log("value username = ", value.username);
        console.log("data author = ", data.author);
        if (value.username !== data.author) {
          this.server.to(key).emit('message', data);
        }
      });
    }
    else {
      this.connectedClients.forEach((value, key) => {
        // check if user is in channel
        console.log("value = ", value);
        console.log("data = ", data.id);

        if (value.id === data.id) {
            this.server.to(data.id.toString()).emit('message', data);
        }
      });
    }
    //this.server.emit('message', data);
    console.log("BEFORE SEND TO CLIENT");
    //this.server.to(client.id).emit('message', data);
  }
}
