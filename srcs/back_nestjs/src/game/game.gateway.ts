import { ConsoleLogger, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
import { delay } from 'rxjs';

interface double_pos {
  y1: number;
  y2: number;
}

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,
    private gameService: GameService,
    private connectedUserService: ConnectedUserService,
    private userService: UserService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  paddle_pos = new Map<string, double_pos>();
  is_playing = new Map<string, boolean>();

  ////////////////////////////////////////////////
  //////////////// CREATE ROOM
  ///////////////////////////////////////////////

  @SubscribeMessage('createGameRoom')
  async CreateRoom(client: Socket, data: any) {
    console.log("data = ", data);
    console.log("client.id = ", client.id);
    const user = (await this.connectedUserService.findBySocketId(client.id)).user;
    let room_game: RoomEntity;

    if (data.room === '')
      room_game = await this.gameService.joinFastRoom(data.room);
    else
      room_game = await this.gameService.joinInvitation(data.room);

    if (room_game) {
      if (room_game.status === RoomStatus.EMPTY) {
        client.join(room_game.room_name);
        room_game.status = RoomStatus.WAITING;
        room_game.game_mode = data.game_mode;
        room_game.p1 = user;
        await this.all_game.save(room_game);
      
        client.emit('joinedRoom', room_game);
      } else if (room_game.status === RoomStatus.WAITING) {
        room_game.status = RoomStatus.PLAYING;
        room_game.p2 = user;

        client.join(room_game.room_name);
        await this.all_game.save(room_game);

        this.gameService.InitSet(room_game.room_name, this.is_playing, data.game_mode);
        this.server.in(room_game.room_name).emit('joinedRoom', room_game);
      } else if (room_game.status === RoomStatus.PLAYING)
        client.emit('fullRoom', room_game);
    }
  }

  ///////////////////////////////////////////////
  //////////////// INGAME ROOM
  ///////////////////////////////////////////////

  ///////////////////////////////////////////////
  //////////////// LEAVE ROOM
  ///////////////////////////////////////////////

  @SubscribeMessage('leaveGameRoom')
  async LeaveRoom(client: Socket, room: string) {
    const user = (await this.connectedUserService.findBySocketId(client.id)).user;
    const room_game = await this.all_game.findOneBy({ room_name: room });
    
    if (!room_game)
      return;
      if (
      room_game.status === RoomStatus.WAITING ||
      room_game.status === RoomStatus.CLOSED
    )
    room_game.status = RoomStatus.EMPTY;
    room_game.room_name = room;
    room_game.p2_ready = false;
    room_game.p1_ready = false;
    
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


  async handleDisconnect(client: Socket) {
    this.logger.log(`Client GAME disconnected: ${client.id}`);
    let room: string;
    const room_game = await this.all_game.findOneBy({ room_name: room });
    if (room_game) {
      if (
        room_game.status === RoomStatus.WAITING ||
        room_game.status === RoomStatus.CLOSED
      )
        this.EndOfTheGame(client, room_game.room_name);
      else if (room_game.status === RoomStatus.PLAYING)
        this.PlayerGiveUp(client, room_game.room_name);
    }
    this.disconnect(client);
  }

  private disconnect(client: Socket) {
    this.connectedUserService.deleteBySocketId(client.id);
    client.disconnect();
  }

  @SubscribeMessage('player_give_up')
  async PlayerGiveUp(client: Socket, room: string) {
    const user = (await this.connectedUserService.findBySocketId(client.id)).user;

    console.log('player_give_up');
    const room_game = await this.all_game.findOneBy({ room_name: room });
    
    if (this.is_playing[room])
    this.is_playing[room] = false;
    
    if (room_game.status === RoomStatus.PLAYING)
    room_game.status = RoomStatus.CLOSED;
    if (room_game.set.p1.name === user.username) {
      room_game.p1 = null;
      room_game.set.p2.won = true;
    }
    else if (room_game.set.p2.name === user.username) {
      room_game.p2 = null;
      room_game.set.p1.won = true;
    }
    
    await this.all_game.save(room_game);
    
    this.server.in(room).emit('player_give_upem', room_game.set, room_game.status);
    client.emit('leftRoomEmpty');
    client.leave(room);
  }

  @SubscribeMessage('end_of_the_game')
  async EndOfTheGame(client: Socket, room: string) {
    client.leave(room);
    console.log('end_of_the_game');
    const room_game = await this.all_game.findOneBy({ room_name: room });
    
    if (this.is_playing[room]) {
      this.is_playing[room] = false;
      console.log('clearInterval end of GAME');
    }
    if (room_game) {
      if (this.paddle_pos[room])
        delete this.paddle_pos[room];
      if (this.is_playing[room])
      delete this.is_playing[room];
      await this.all_game.remove(room_game);
    }
    client.emit('leftRoomEmpty');
    return;
  }

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA
  ///////////////////////////////////////////////

  @SubscribeMessage('ask_paddle_p1')
  async ask_paddle_p1(client: Socket, data: PaddleDto) {
    client.to(data.room).emit('get_paddle_p1',
    (data.paddle_y * canvas_back_height) / data.front_canvas_height);
    if (!this.paddle_pos[data.room])
      this.paddle_pos[data.room] = { y1: 0, y2: 0 };
    this.paddle_pos[data.room] = {
      y1: (data.paddle_y * canvas_back_height) / data.front_canvas_height,
      y2: this.paddle_pos[data.room].y2,
    };
  }

  @SubscribeMessage('ask_paddle_p2')
  async ask_paddle_p2(client: Socket, data: PaddleDto) {
    client.to(data.room).emit('get_paddle_p2',
    (data.paddle_y * canvas_back_height) / data.front_canvas_height);
    if (!this.paddle_pos[data.room])
      this.paddle_pos[data.room] = { y1: 0, y2: 0 };
    this.paddle_pos[data.room] = {
      y1: this.paddle_pos[data.room].y1,
      y2: (data.paddle_y * canvas_back_height) / data.front_canvas_height,
    };
  }

  ///////////////////////////////////////////////
  ///////////////////////////////////////////////

  @SubscribeMessage('start_game_render')
  async start_game_render(client: Socket, room: string) {
    let room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game)
      return console.log(' start_game_render !!!!! NO ROOM !!!! [' + room + ']',);
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

  @SubscribeMessage('resize_ingame')
  async resize_ingame(client: Socket, room: string) {
    const room_game = await this.all_game.findOneBy({ room_name: room });
    if (!room_game) {
      console.log('NO ROOM GAME', room);
      return;
    }
    client.emit('resize_game');
  }
}
