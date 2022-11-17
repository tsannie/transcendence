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
import { Repository } from 'typeorm';
import { MessageDto } from './dto/message.dto';
import { AuthService } from 'src/auth/service/auth.service';

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
    private authService: AuthService,
  ) {}

  private readonly logger: Logger = new Logger('messageGateway');
  connectedUsers = new Map<string, Socket>();

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Init');
  }

  // all clients connect to the server
  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    let user: UserEntity;

    try {
      user = await this.authService.validateSocket(client);

      if (!user) {
        return this.disconnect(user.id, client);
      } else {
        this.connectedUsers.set(user.id, client);
      }
    } catch {
      return this.disconnect(user.id, client);
    }
  }

  async handleDisconnect(@ConnectedSocket () client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = await this.authService.validateSocket(client);

    client.disconnect();
    this.disconnect(user.id, client);
  }

  private disconnect(userId: string, client: Socket) {
    this.connectedUsers.delete(userId);
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

      await this.messageService.emitMessageDm(this.server, lastMsg, this.connectedUsers);
    } else {
      const lastMsg = await this.messageService.addMessagetoChannel(data);

      await this.messageService.emitMessageChannel(this.server, lastMsg);
    }
  }
}
