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
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { canvas_back_height } from './const/const';
import { GameService } from './service/game.service';
import { PaddleDto } from './dto/paddle.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { GameStatEntity } from './entity/gameStat.entity';
import { AuthService } from 'src/auth/service/auth.service';
import Room, { RoomStatus, Winner } from './class/room.class';

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    // @InjectRepository(RoomEntity)
    // private all_game: Repository<RoomEntity>,
    private gameService: GameService,
    private authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');

  game = new Map<string, Room>();

  async handleConnection(client: Socket) {
    this.logger.log(`Client GAME connected: ${client.id}`);
    try {
      const user = await this.authService.validateSocket(client);

      if (!user) {
        return client.disconnect();
      }
    } catch {
      return client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client GAME disconnected: ${client.id}`);
    const user = await this.authService.validateSocket(client);

    console.log('handleDisconnect user: ', user.username);

    if (!user) return client.disconnect();
    const room = this.gameService.findRoomBySocketId(client.id, this.game);
    if (room) {
      console.log('handleDisconnect room FIND: ');
      if (room.status === RoomStatus.PLAYING)
        await this.giveUp(client, room.id);
    }
    client.disconnect();
  }

  ///////////////////////////////////////////////
  //////////////// CREATE ROOM
  ///////////////////////////////////////////////

  @SubscribeMessage('createGameRoom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateRoomDto,
  ) {
    console.log('createRoom');
    const user = await this.authService.validateSocket(client);
    //this.game.clear();

    if (!user) return client.emit('error', 'create Room error !'); // TODO: send error
    const room: Room = this.gameService.joinFastRoom(user, this.game);
    console.log(
      '##############################START###########################\n',
    );

    console.log('dico (', this.game.size, '):');

    if (room && user) {
      console.log('Hello');
      if (room.status === RoomStatus.EMPTY) {
        room.game_mode = data.mode;
        room.p1_id = user.id;
        room.p1_SocketId = client.id;
        room.status = RoomStatus.WAITING;

        this.game.set(room.id, room);
        client.join(room.id);
        this.server.in(room.id).emit('joinedRoom', room);
      } else if (room.status === RoomStatus.WAITING) {
        room.p2_id = user.id;
        room.p2_SocketId = client.id;
        room.status = RoomStatus.PLAYING;

        client.join(room.id);
        this.server.in(room.id).emit('joinedRoom', room);
        this.gameService.launchGame(room, this.server, this.game);
        // TODO launch game
      }
    }
  }

  ///////////////////////////////////////////////
  //////////////// LEAVE ROOM/
  ///////////////////////////////////////////////

  @SubscribeMessage('leaveGameRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room_id: string,
  ) {
    console.log('-----------------leaveRoom-----------------');

    const user = await this.authService.validateSocket(client);
    if (!user) return;
    const room = this.game.get(room_id);

    if (!room) return;

    console.log('leaveGameRoom: ');
    console.log('ROOM DELETE');
    this.game.delete(room_id); // no ???
    client.leave(room_id);
  }

  ///////////////////////////////////////////////
  //////////////// LEAVE GAME
  /////////////////////////////////////////////////

  @SubscribeMessage('giveUp')
  async giveUp(
    @ConnectedSocket() client: Socket,
    @MessageBody() room_id: string,
  ) {
    console.log('GIVEUP');
    //this.game.clear(); // TODO: remove
    const user = await this.authService.validateSocket(client);
    if (!user) return;

    const room = this.game.get(room_id);
    if (!room) console.log('giveUp room not found');

    room.status = RoomStatus.CLOSED;
    room.won = user.id === room.p1_id ? Winner.P2 : Winner.P1;
    // TODO: save gameStat
    console.log('room_before_delete:', room);
    this.game.delete(room_id);

    this.server.in(room_id).emit('giveUp', room.p1_id, room.p2_id); // TODO GIVE UP
    client.leave(room_id);
  }

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA
  ///////////////////////////////////////////////

  @SubscribeMessage('setPaddleP1')
  async setPaddleP1(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PaddleDto,
  ) {
    const root = this.game.get(data.room_id);

    // todo check if the user is really the player 1

    if (!root) return;

    root.p1_y_paddle =
      (data.positionY * canvas_back_height) / data.front_canvas_height;

    //client.to(data.room_id).emit('getPaddleP1', root.p1_y_paddle);
  }

  @SubscribeMessage('setPaddleP2') // one setpadle for both player
  async setPaddleP2(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PaddleDto,
  ) {
    const root = this.game.get(data.room_id);

    // todo check if the user is really the player 2

    if (!root) {
      console.log('p2notfound');
      return;
    }
    root.p2_y_paddle =
      (data.positionY * canvas_back_height) / data.front_canvas_height;

    //client.to(data.room_id).emit('getPaddleP2', root.p2_y_paddle);
  }
  ///////////////////////////////////////////////

  /*@SubscribeMessage('resizeIngame')
  async resizeIngame(@MessageBody() room_id: string) {
    const room_game = this.game.get(room_id);
    if (!room_game) return;
    this.server.in(room_id).emit('resize_game');
  }*/
}
