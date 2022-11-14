import {
  Get,
  Injectable,
  Logger,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
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
import { UserEntity } from 'src/user/models/user.entity';
import { ConnectedUserEntity } from 'src/connected-user/connected-user.entity';
import { Repository } from 'typeorm';
import { ConnectedUserService } from 'src/connected-user/service/connected-user.service';
import { ConnectedUserDto } from 'src/connected-user/dto/connected-user.dto';
import { MessageDto } from './dto/message.dto';

// cree une websocket sur le port par defaut
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
  },
  namespace: 'chat',
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private connectedUserService: ConnectedUserService,
  ) {}

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
      console.log('userId = ', userId);
      if (typeof userId === 'string') {
        user = await this.userService.findById(userId);
      }
      if (!user) {
        return this.disconnect(client);
      } else {
        let connectedUser = new ConnectedUserDto();

        connectedUser.socketId = client.id;
        connectedUser.user = user;
        this.connectedUserService.create(connectedUser);
      }
    } catch {
      return this.disconnect(client);
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    this.connectedUserService.deleteBySocketId(client.id);
    client.disconnect();
  }

  private disconnect(client: Socket) {
    this.connectedUserService.deleteBySocketId(client.id);
    client.disconnect();
  }

  @SubscribeMessage('message')
  async addMessage(
    @MessageBody() data: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('data = ', data);
    this.logger.log('client id = ', client.id);

    if (data.isDm === true) {
      const lastMsg = await this.messageService.addMessagetoDm(data);

      await this.messageService.emitMessageDm(this.server, lastMsg);
    } else {
      const lastMsg = await this.messageService.addMessagetoChannel(data);

      await this.messageService.emitMessageChannel(this.server, lastMsg);
    }
  }
}
