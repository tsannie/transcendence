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
import { v4 as uuidv4 } from 'uuid';
import { from, map, Observable } from 'rxjs';
import { Socket, Server, Namespace } from 'socket.io';
import { Repository } from 'typeorm';
import { MessageEntity } from './models/message.entity';
import { Adapter } from 'socket.io-adapter';
import { MessageChannel } from 'worker_threads';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { uuid } from 'uuidv4';
import { UserService } from 'src/user/service/user.service';
import { ChannelService } from 'src/channel/service/channel.service';
import { DmService } from 'src/dm/service/dm.service';
import { IMessage } from './models/message.interface';
import { targetDto } from 'src/user/dto/target.dto';
import { AuthService } from 'src/auth/service/auth.service';
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
    private channelService: ChannelService,
    private userService: UserService,
    private dmService: DmService,
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
    console.log("map clients = ", this.connectedClients);
    client.disconnect();
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }

  @SubscribeMessage('message')
  addMessage(@MessageBody() data: IMessage, @ConnectedSocket() client: Socket) {
    //): Observable<IMessage> {
    this.logger.log(client.id);
    console.log(data);

    if (data.target !== undefined) {
      this.messageService.addMessagetoDm(data);
    } else {
      this.messageService.addMessagetoChannel(data);
    }

    // emit to all clients
    //this.server.emit('message', data);

    // parcourir tous mes clients connectés et envoyer le message uniquement a l'id du target
    this.connectedClients.forEach((value, key) => {
      console.log("key = ", key);
      console.log("value = ", value);
      console.log("data.target = ", data.target);
      if (value.username === data.target) {
        this.server.to(key).emit('message', data);
      }
    });
    //this.server.to(client.id).emit('message', data);
  }

  // emit all dms of a user
  /* @SubscribeMessage('getDmList')
  getDmList(@MessageBody() data: string, @ConnectedSocket() client: Socket) {

    console.log("data = ", data);

    let allDms = this.dmService.getAllDms(this.connectedClients.get(client.id));
    this.logger.log(`client ${client.id} get all dm ${allDms} `);
    console.log("allDms = ", allDms);
    this.server.emit('getDmList', allDms);
  }

  @SubscribeMessage('getConv')
  getConv(@MessageBody() data: string, @ConnectedSocket() client: Socket) {

    console.log("data = ", data);

    // get id of the dm in data

    // return all messages of a dm with his id
    //let allMessages = this.dmService.getDmById();
    this.server.emit('getConv', data);
  } */
}
