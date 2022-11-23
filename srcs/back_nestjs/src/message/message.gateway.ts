import {
  forwardRef,
  Get,
  Inject,
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
import { ChannelService } from 'src/channel/service/channel.service';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { BanEntity, MuteEntity } from 'src/channel/models/ban.entity';

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
    private authService: AuthService,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,
  ) {}

  private readonly logger: Logger = new Logger('messageGateway');
  connectedUsers = new Map<string, Socket[]>();

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Init');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    let user: UserEntity;
    try {
      user = await this.authService.validateSocket(client);

      if (!user) {
        // TODO moove im map and remove ConnectedUserEntity (dov)
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
      return client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = await this.authService.validateSocket(client);

    if (user) {
      this.disconnect(user.id, client);
    }
    else
      client.disconnect();
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
    const user = await this.authService.validateSocket(client);

    if (data.isDm === true) {
      const lastMsg = await this.messageService.addMessagetoDm(data, user.id);

      this.messageService.emitMessageDm(lastMsg, this.connectedUsers);
    } else {
      const lastMsg = await this.messageService.addMessagetoChannel(this.server, client.id, data, user.id);
      const channel = await this.channelService.getChannelById(
        lastMsg.channel.id,
      );

      if (channel) {
        this.messageService.emitMessageChannel(channel, lastMsg, this.connectedUsers);
      }
    }
  }

  createChannel(channel: ChannelEntity, userId: string) {
    console.log("channel created : " + channel.id);
    const socket = this.connectedUsers.get(userId);

    if (socket) {
      // join the channel
      socket.forEach((client) => {
        client.join(channel.id);
      });
    }
    //this.server.emit('newChannel', channel);
  }

  joinChannel(channel: ChannelEntity, userId: string) {
    console.log("channel joined");
    // find the socket of the user
    const sockets = this.connectedUsers.get(userId);

    if (sockets) {
      // join the channel
      sockets.forEach((client) => {
        client.join(channel.id);
      });
    }
    this.server.to(channel.id).emit('joinChannel', channel);
  }

  muteUser(mutedUser: MuteEntity) {
    this.server.to(mutedUser.channel.id).emit('muteUser', mutedUser.user);
  }

  unMuteUser(unMutedUser: MuteEntity) {
    this.server.emit('unMuteUser', unMutedUser.user);
  }

  banUser(bannedUser: BanEntity) {
    this.server.emit('banUser', bannedUser.user);
  }

  unBanUser(unBannedUser: BanEntity) {
    this.server.emit('unBanUser', unBannedUser.user);
  }

  makeAdmin(newAdmin: UserEntity) {
    this.server.emit('makeAdmin', newAdmin);
  }

  revokeAdmin(revokeAdmin: UserEntity) {
    this.server.emit('revokeAdmin', revokeAdmin);
  }
}
