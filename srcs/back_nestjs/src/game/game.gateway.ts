import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { canvas_back_height } from './const/const';
import { GameService } from './service/game.service';
import { PaddleDto } from './dto/paddle.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { AuthService } from 'src/auth/service/auth.service';
import Room, { IInfoGame, RoomStatus, Winner } from './class/room.class';
import { UserEntity } from 'src/user/models/user.entity';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gameService: GameService,
    private authService: AuthService,
  ) {}

  // Player / SocketPlayer
  private allUsers: Map<string, Socket[]> = new Map();

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');

  async handleConnection(client: Socket) {
    const user = await this.authService.validateSocket(client, {
      friends: true,
    });
    if (!user) return;

    // if user dont have other socket send to his friends that he is online
    if (!this.allUsers.has(user.id))
      this.gameService.preventConnexionOfFriends(
        this.server,
        user,
        this.allUsers,
      );

    if (this.allUsers.has(user.id)) {
      this.allUsers.get(user.id).push(client);
    } else this.allUsers.set(user.id, [client]);

    this.server.emit('infoGame', this.gameService.getInfo(this.allUsers));
    this.logger.log(`Client GAME connected: ${user.username}`);
  }

  async handleDisconnect(client: Socket) {
    const user = await this.authService.validateSocket(client, {
      friends: true,
    });
    if (!user) return;

    // if user dont have other socket send to his friends that he is offline
    if (this.allUsers.get(user.id).length === 1)
      this.gameService.preventConnexionOfFriends(
        this.server,
        user,
        this.allUsers,
        false,
      );

    const room = this.gameService.findRoomBySocket(client);
    if (room && room.status === RoomStatus.WAITING && room.p1_id === user.id) {
      this.gameService.deleteRoomById(room.id);
    }

    this.gameService.leaveRoom(null, client);

    if (this.allUsers.has(user.id)) {
      const sockets = this.allUsers.get(user.id);
      const index = sockets.indexOf(client);
      //console.log('sockets.length', sockets.length);
      if (index > -1) {
        sockets.splice(index, 1);
      }
      if (sockets.length === 0) {
        this.allUsers.delete(user.id);
      }
    }

    this.server.emit('infoGame', this.gameService.getInfo(this.allUsers));
    client.disconnect();
    this.logger.log(`Client GAME disconnected: ${user.username}`);
  }

  ///////////////////////////////////////////////
  //////////////// CREATE ROOM
  ///////////////////////////////////////////////

  getFriendsLog(user: UserEntity): UserEntity[] {
    return this.gameService.getFriendsLog(this.allUsers, user);
  }

  @SubscribeMessage('matchmaking')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateRoomDto,
  ) {
    const user = await this.authService.validateSocket(client);
    if (!user) throw new WsException('User not found');

    if (this.gameService.findRoomByUser(user)) {
      throw new WsException('Already in game');
    }

    const room: Room = this.gameService.findRoom(user, data.mode);

    if (room && user) {
      if (room.status === RoomStatus.EMPTY) {
        room.status = RoomStatus.WAITING;

        this.gameService.joinRoom(room.id, client, this.server);
        this.server.to(client.id).emit('updateGame', room);
        this.server.to(room.id).emit('joinQueue', 'queue joined ...');
      } else if (room.status === RoomStatus.WAITING) {
        room.p2_id = user.id;
        room.status = RoomStatus.PLAYING;

        this.gameService.joinRoom(room.id, client, this.server);
        this.server.to(room.id).emit('updateGame', room);
        this.server.to(room.id).emit('matchFound', 'match found !');
        this.gameService.launchGame(room, this.server, this.allUsers);
      }
    }
    this.server.emit('infoGame', this.gameService.getInfo(this.allUsers));
  }

  ///////////////////////////////////////////////
  //////////////// ROOM/
  ///////////////////////////////////////////////

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room_id: string,
  ) {
    this.gameService.joinRoom(room_id, client, this.server);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room_id: string,
  ) {
    const user = await this.authService.validateSocket(client);
    if (!user) throw new WsException('User not found');

    const room: Room = this.gameService.getRoomById(room_id);

    if (room && room.status === RoomStatus.WAITING && room.p1_id === user.id) {
      this.gameService.deleteRoomById(room.id);
    }

    this.gameService.leaveRoom(room_id, client);
    this.server.emit('infoGame', this.gameService.getInfo(this.allUsers));
  }

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA
  ///////////////////////////////////////////////

  @SubscribeMessage('setPaddle')
  async setPaddle(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PaddleDto,
  ) {
    const user = await this.authService.validateSocket(client);
    if (!user) throw new WsException('User not found');

    const room = this.gameService.getRoomById(data.room_id);
    if (!room) return;

    if (room.p1_id === user.id) room.p1_y_paddle = data.posY;
    else if (room.p2_id === user.id) room.p2_y_paddle = data.posY;
  }
  ///////////////////////////////////////////////
}
