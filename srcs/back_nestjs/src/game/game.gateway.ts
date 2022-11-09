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
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { canvas_back_height, victory_score } from './const/const';
import { BallCol_p1, BallCol_p2, mouv_ball } from './gamefunction';
import { RoomEntity, RoomStatus } from './game_entity/room.entity';
import { GameService } from './game_service/game.service';
import { PaddleDto } from './dto/paddle.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { ConnectedUserService } from 'src/connected-user/service/connected-user.service';
import { ConnectedUserEntity } from 'src/connected-user/connected-user.entity';
import { CreateRoomDto } from './dto/createRoom.dto';

export interface PaddlePos {
  y1: number;
  y2: number;
}

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: 'http://localhost:3000',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,
    private gameService: GameService,
    private connectedUserService: ConnectedUserService,
    private userService: UserService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');

  paddle_pos = new Map<string, PaddlePos>();
  is_playing = new Map<string, boolean>();

  async handleConnection(client: Socket) {
    this.logger.log(`Client GAME connected: ${client.id}`);
    try {
      let userId = client.handshake.query.userId;
      let user: UserEntity;
      console.log('userId = ', userId);
      if (typeof userId === 'string') {
        user = await this.userService.findById(parseInt(userId));
      }
      if (!user) {
        return this.disconnect(client);
      } else {
        let connectedUser = new ConnectedUserEntity();

        connectedUser.socketId = client.id;
        connectedUser.user = user;
        this.connectedUserService.create(connectedUser);
      }
    } catch {
      return this.disconnect(client);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client GAME disconnected: ${client.id}`);
    let room: string;
    const room_game = await this.all_game.findOneBy({ room_name: room });
    if (room_game) {
      if (
        room_game.status === RoomStatus.WAITING ||
        room_game.status === RoomStatus.CLOSED
      )
        this.endGame(client, room_game.room_name);
      else if (room_game.status === RoomStatus.PLAYING)
        this.giveUp(client, room_game.room_name);
    }
    this.disconnect(client);
  }

  private disconnect(client: Socket) {
    this.connectedUserService.deleteBySocketId(client.id);
    client.disconnect();
  }

  ////////////////////////////////////////////////
  //////////////// CREATE ROOM
  ///////////////////////////////////////////////

  @SubscribeMessage('createGameRoom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: CreateRoomDto,
  ) {
    const user = (await this.connectedUserService.findBySocketId(client.id))
      .user;
    let room_game: RoomEntity;

    if (data.room === '')
      room_game = await this.gameService.joinFastRoom(data.room);
    else room_game = await this.gameService.joinInvitation(data.room);

    if (room_game) {
      if (room_game.status === RoomStatus.EMPTY) {
        client.join(room_game.room_name);
        room_game.status = RoomStatus.WAITING;
        room_game.game_mode = data.mode;
        room_game.p1 = user;
        await this.all_game.save(room_game);

        client.emit('joinedRoom', room_game);
      } else if (room_game.status === RoomStatus.WAITING) {
        client.join(room_game.room_name);
        room_game.status = RoomStatus.PLAYING;
        room_game.p2 = user;

        await this.all_game.save(room_game);

        this.gameService.initSet(
          room_game.room_name,
          this.is_playing,
          data.mode,
        );
        this.server.in(room_game.room_name).emit('joinedRoom', room_game);
      }
    }
  }

  ///////////////////////////////////////////////
  //////////////// LEAVE ROOM
  ///////////////////////////////////////////////

  @SubscribeMessage('leaveGameRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const user = (await this.connectedUserService.findBySocketId(client.id)).user;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game)
      return;
    if (room_game.status === RoomStatus.WAITING ||
    room_game.status === RoomStatus.CLOSED)
      room_game.status = RoomStatus.EMPTY;
    room_game.room_name = room;

    if (room_game.p1.id === user.id) {
      room_game.p1 = room_game.p2;
      room_game.p2 = null;
    } else if (room_game.p2.id === user.id)
      room_game.p2 = null;

    if (room_game.status === RoomStatus.EMPTY) {
      await this.all_game.remove(room_game);
      this.server.in(room).emit('leftRoomEmpty');
      client.leave(room);
      return;
    }
    await this.all_game.save(room_game);
    this.server.in(room).emit('leftRoom', room_game);
    client.leave(room);
  }

  ///////////////////////////////////////////////
  //////////////// PLAYER GIVE UP
  /////////////////////////////////////////////////

  @SubscribeMessage('giveUp')
  async giveUp(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    const user = (await this.connectedUserService.findBySocketId(client.id)).user;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    this.gameService.giveUp(room, this.is_playing, room_game, user);

    this.server.in(room).emit('giveUp', room_game.set, room_game.status);
    client.emit('leftRoomEmpty');
    client.leave(room);
  }

  @SubscribeMessage('endGame')
  async endGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    client.leave(room);
    console.log('endGame');
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (this.is_playing[room]) {
      this.is_playing[room] = false;
      console.log('clearInterval end of GAME');
    }
    if (room_game) {
      if (this.paddle_pos[room]) delete this.paddle_pos[room];
      if (this.is_playing[room]) delete this.is_playing[room];
      await this.all_game.remove(room_game);
    }
    client.emit('leftRoomEmpty');
    return;
  }

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA
  ///////////////////////////////////////////////

  @SubscribeMessage('askPaddleP1')
  async askPaddleP1(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PaddleDto,
  ) {
    client.to(data.room).emit('getPaddleP1',(data.positionY * canvas_back_height) / data.front_canvas_height);
    if (!this.paddle_pos[data.room])
      this.paddle_pos[data.room] = { y1: 0, y2: 0 };
    this.paddle_pos[data.room] = {
      y1: (data.positionY * canvas_back_height) / data.front_canvas_height,
      y2: this.paddle_pos[data.room].y2,
    };
  }

  @SubscribeMessage('askPaddleP2')
  async askPaddleP2(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PaddleDto,
  ) {
    client.to(data.room).emit('getPaddleP2',(data.positionY * canvas_back_height) / data.front_canvas_height);
    if (!this.paddle_pos[data.room])
      this.paddle_pos[data.room] = { y1: 0, y2: 0 };
    this.paddle_pos[data.room] = {
      y1: this.paddle_pos[data.room].y1,
      y2: (data.positionY * canvas_back_height) / data.front_canvas_height,
    };
  }

  ///////////////////////////////////////////////
  ///////////////////////////////////////////////

  @SubscribeMessage('gameRender')
  async gameRender(@MessageBody() room: string) {
    let room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game)
      return console.log(' gameRender !!!!! NO ROOM !!!! [' + room + ']');
    if (room_game.set) {
      while (
        room_game.set.p1.score !== victory_score &&
        room_game.set.p2.score !== victory_score &&
        this.is_playing[room] === true
      ) {
        mouv_ball(room_game.set);
        BallCol_p1(room_game.set, this.paddle_pos[room], this.server, room);
        BallCol_p2(room_game.set, this.paddle_pos[room], this.server, room);

        this.server.in(room).emit('get_ball', room_game.set.ball.x, room_game.set.ball.y);
        await new Promise((f) => setTimeout(f, 8));
      }
      await this.all_game.save(room_game);
    }
    return;
  }

  @SubscribeMessage('resizeIngame')
  async resizeIngame(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const room_game = await this.all_game.findOneBy({ room_name: room });
    if (!room_game)
      return;
    client.emit('resize_game');
  }
}
