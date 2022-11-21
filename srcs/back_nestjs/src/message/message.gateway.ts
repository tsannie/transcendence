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
  connectedUsers = new Map<string, Socket[]>();

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
      //user = await this.authService.validateSocket(client);

      let userId = client.handshake.query.userId;
      console.log('userId = ', userId);
      if (typeof userId === 'string') {
        user = await this.userService.findById(userId);
      }
      if (!user) {
        return client.disconnect();
      } else {
        // if user id already have a socket, add the new one to the array
        if (this.connectedUsers.has(user.id)) {
          this.connectedUsers.get(user.id).push(client);
        } else {
          this.connectedUsers.set(user.id, [client]);
        }
      }
    } catch {
      return this.disconnect(user.id, client);
    }
  }

  async handleDisconnect(@ConnectedSocket () client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    //const user = await this.authService.validateSocket(client);

    client.disconnect();
    //this.disconnect(user.id, client);
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
    const userId = client.handshake.query.userId; //todo PROTEGER TRYCATCH

    if (data.isDm === true) {
      const lastMsg = await this.messageService.addMessagetoDm(data, userId.toString());

      await this.messageService.emitMessageDm(lastMsg, this.connectedUsers);
    } else {
      const lastMsg = await this.messageService.addMessagetoChannel(data, userId.toString());

      await this.messageService.emitMessageChannel(lastMsg, this.connectedUsers);
    }
  }
}
