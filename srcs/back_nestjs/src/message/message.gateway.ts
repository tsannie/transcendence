import { Get, Injectable, Logger, Request, UseGuards } from '@nestjs/common';
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
import { IMessage } from './models/message.interface';
import { Adapter } from 'socket.io-adapter';
import { MessageChannel } from 'worker_threads';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { uuid } from 'uuidv4';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/service/user.service';
import { IChannel } from 'src/channel/models/channel.interface';
import { ChannelService } from 'src/channel/service/channel.service';

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
    private channelService: ChannelService
  ) {}


  connectedClients = [];
  private readonly logger: Logger = new Logger('messageGateway');

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  addMessage(
    @MessageBody() data: IMessage,
    @ConnectedSocket() client: Socket,
  ): void {
    this.logger.log(client.id);
    //this.logger.log(this.server.socketsJoin(data.room))

    //const newRoom : RoomEntity = this.roomService.getRoomById();
    const newMessage: IMessage = {
      // message de base + uuid
      id: uuidv4(),
      room: data.room,
      author: data.author,
      content: data.content,
      time: data.time,
      //room: newRoom
    };
    this.messageService.add(newMessage);
    //if (Object.keys(this.allMessages).length === 0) // join room if conversation started
    // join room
    client.to(newMessage.room).emit('message', newMessage);
  }

  afterInit() {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.push(client);
    this.connectedClients.forEach(client => {
      console.log(client.id);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients = this.connectedClients.filter((connectedClient) => {
      return connectedClient !== client.id;
    });
  }

  // Quand tu doubles cliques sur un utilisateur, cela va cree une room pour pouvoir le dm

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    client.join(data);

    // parcourt mon tableau de client et affiche les id des clients dispo !
    /* this.connectedClients.forEach( (connectedClient) => {
      console.log(connectedClient.id);
    }); */
    this.logger.log(`client ${client.id} join room ${data} `);
  }

  @SubscribeMessage('createChannel')
  createChannel(@MessageBody() data: IChannel, @ConnectedSocket() client: Socket) {
    client.join(data.id);
    console.log(data);
    this.logger.log(`client ${client.id} create channel ${data} `);
    this.channelService.handleChannels(data);
  }
}
