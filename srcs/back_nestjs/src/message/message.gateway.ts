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
import { UserEntity } from 'src/user/models/user.entity';
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
    private authService: AuthService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
    @Inject(forwardRef(() => ChannelService))
    private channelService: ChannelService,

    private userService: UserService,
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
        return client.disconnect();
      } else {
        // if user id already have a socket, add the new one to the array
        if (this.connectedUsers.has(user.id)) {
          this.connectedUsers.get(user.id).push(client);
        } else {
          this.connectedUsers.set(user.id, [client]);
        }
        // join all channel of the user
        const channels = await this.channelService.getChannelsByUser(user.id);

        channels.forEach((channel) => {
          client.join(channel.id);
        });
      }
    } catch {
      return client.disconnect();
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    const user = await this.authService.validateSocket(client);

    if (user) {
      await this.disconnect(user.id, client);
    }
    else
      client.disconnect();
  }

  private async disconnect(userId: string, client: Socket) {
    const channels = await this.channelService.getChannelsByUser(userId);

    channels.forEach((channel) => {
      client.leave(channel.id);
    });

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
      const lastMsg = await this.messageService.addMessagetoChannel(data, user.id);
      const channel = await this.channelService.getChannelById(
        lastMsg.channel.id,
      );

      if (channel) {
        this.messageService.emitMessageChannel(
          channel,
          lastMsg,
          this.connectedUsers,
        );
      }
    }
  }

  joinChannel(user: UserEntity, channelId: string) {
    this.joinAllSocketToChannel(user.id, channelId);
    this.server.to(channelId).emit('joinChannel', user, channelId);
  }

  leaveChannel(user: UserEntity, channel: ChannelEntity) {
    this.server.to(channel.id).emit('leaveChannel', user, channel.id, channel.owner);
    this.leaveAllSocketToChannel(user.id, channel.id);
  }

  deleteChannel(channelId: string) {
    this.server.to(channelId).emit('deleteChannel', channelId);
  }

  async inviteChannel(targetId: string, channel: ChannelEntity) {
    const target = await this.userService.findById(targetId); //TODO: change to find by id if i can send id by front

    console.log("target == ", target);
    this.connectedUsers.get(target.id).forEach((socket) => {
      this.server.to(socket.id).emit('inviteChannel', channel);
    });
    //this.server.to(channelId).emit('inviteChannel', channelId);
  }

  muteUser(mutedUser: MuteEntity) {
    this.server.to(mutedUser.channel.id).emit('muteUser', mutedUser.user, mutedUser.channel.id,  mutedUser.end);
  }

  unMuteUser(unMutedUser: MuteEntity, channelId: string) {
    this.server.to(channelId).emit('unMuteUser', unMutedUser.user, channelId);
  }

  banUser(bannedUser: BanEntity) {
    this.server.to(bannedUser.channel.id).emit('banUser', bannedUser.user, bannedUser.channel.id);
  }

  unBanUser(unBannedUser: BanEntity, channelId: string) {
    this.server.to(channelId).emit('unBanUser', unBannedUser.user, channelId);
  }

  makeAdmin(newAdmin: UserEntity, channelId: string) {
    this.server.to(channelId).emit('makeAdmin', newAdmin, channelId);
  }

  revokeAdmin(revokeAdmin: UserEntity, channelId: string) {
    this.server.to(channelId).emit('revokeAdmin', revokeAdmin, channelId);
  }

  joinAllSocketToChannel(userId: string, channelId: string) {
    const sockets = this.connectedUsers.get(userId);

    if (sockets) {
      sockets.forEach((client) => {
        client.join(channelId);
      });
    }
  }

  leaveAllSocketToChannel(userId: string, channelId: string) {
    const sockets = this.connectedUsers.get(userId);

    if (sockets) {
      sockets.forEach((client) => {
        client.leave(channelId);
      });
    }
  }
}
