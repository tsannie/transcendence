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
import { canvas_back_height, RoomStatus } from './const/const';
import { RoomEntity } from './entity/room.entity';
import { GameService } from './service/game.service';
import { PaddleDto } from './dto/paddle.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { CreateRoomDto } from './dto/createRoom.dto';
import { IBall, PaddlePos } from './const/interface';
import { GameStatEntity } from './entity/gameStat.entity';
import { AuthService } from 'src/auth/service/auth.service';
import Room from './class/room.class';


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

  //paddle_pos = new Map<string, PaddlePos>();
  //game_loop = new Map<string, boolean>();

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

    if (!user)
      return client.disconnect();
    const room_game = this.game[user.id];

    if (room_game) {
      if (
        room_game.status === RoomStatus.WAITING ||
        room_game.status === RoomStatus.CLOSED
      )
        await this.endGame(client, room_game.id);
      else if (room_game.status === RoomStatus.PLAYING)
        await this.giveUp(client, room_game.id);
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
    const user = await this.authService.validateSocket(client);

    if (!user)
      return client.emit("error", "create Room error !");  // TODO: send error 
    const room_game: Room = await this.gameService.joinFastRoom(user, this.game);

    if (room_game && user) {
      if (room_game.status === RoomStatus.EMPTY) {
        room_game.status = RoomStatus.WAITING;
        room_game.game_mode = data.mode;
        room_game.p1 = user;
        room_game.p1_SocketId = client.id;

        this.game[room_game.id] = room_game;
        //await this.all_game.save(room_game);
        client.join(room_game.id);
        client.emit('joinedRoom', room_game);
      } else if (room_game.status === RoomStatus.WAITING) {
        client.join(room_game.id);
        room_game.status = RoomStatus.PLAYING;
        room_game.p2 = user;
        room_game.p2_SocketId = client.id;

        //room_game.is_playing[roomid] = true;
        this.game[room_game.id] = room_game;
        //await this.all_game.save(room_game);
        this.server.in(room_game.id).emit('joinedRoom', room_game);
      }
    }
  }

  ///////////////////////////////////////////////
  //////////////// LEAVE ROOM/
  ///////////////////////////////////////////////

  @SubscribeMessage('leaveGameRoom')
  async leaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const user = await this.authService.validateSocket(client);
    if (!user)
      return;
    const room_game = this.game[room]

    if (!room_game)
      return;
    if (room_game.status === RoomStatus.WAITING ||
    room_game.status === RoomStatus.CLOSED)
      room_game.status = RoomStatus.EMPTY;
    room_game.id = room;

    if (room_game.p1.id === user.id)
      room_game.p1 = null;
    else if (room_game.p2.id === user.id)
      room_game.p2 = null;
    if (room_game.status === RoomStatus.EMPTY) {
      //await this.all_game.remove(room_game);

      delete this.game[room];
      client.leave(room);
      return;
    }
    //await this.all_game.save(room_game);
    delete this.game[room];
    client.leave(room);
  }

  ///////////////////////////////////////////////
  //////////////// LEAVE GAME
  /////////////////////////////////////////////////

  @SubscribeMessage('giveUp')
  async giveUp(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    console.log('giveUp');
    const user = await this.authService.validateSocket(client);

    if (!user)
      return;
    const room_game = this.game[room];

    await this.gameService.giveUp(room, room_game, user);
    this.server.in(room).emit('giveUp', room_game.set.p1, room_game.set.p2);
    client.leave(room);
  }

  @SubscribeMessage('endGame')
  async endGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    console.log('endGame');
    client.leave(room);
    const room_game = this.game[room];

    //if (this.game_loop[room])
    //  this.game_loop[room] = false;
    if (room_game) {
      if (room_game.set) { // partie annule, 1 mec a rejoint, l'autre handleDisconnect
        await this.gameService.getStat(room_game);
      }

/*       if (this.game.paddle_pos[room])
        delete this.paddle_pos[room];
      if (this.game_loop[room])
        delete this.game_loop[room]; */

      delete this.game[room];
      //await this.all_game.remove(room_game);
    }
  }

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA
  ///////////////////////////////////////////////

  @SubscribeMessage('askPaddleP1')
  async askPaddleP1(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PaddleDto,
  ) {
    const game = this.game[data.room];

    game.p1_y_padddle = (data.positionY * canvas_back_height) / data.front_canvas_height;

    client.to(data.room).emit('getPaddleP1', game.p1_y_padddle.y1);
  }

  @SubscribeMessage('askPaddleP2')
  async askPaddleP2(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: PaddleDto,
  ) {
    const game = this.game[data.room];

    game.p2_y_padddle = (data.positionY * canvas_back_height) / data.front_canvas_height;
  
    client.to(data.room).emit('getPaddleP2', game.p1_y_padddle.y2);
  }

  ///////////////////////////////////////////////

  @SubscribeMessage('gameRender')
  async gameRender(@MessageBody() room: string) {
    let room_game = this.game[room];
    if (!room_game)
      return console.log(' gameRender !!!!! NO ROOM !!!! [' + room + ']');

    let BallObj: IBall = this.gameService.createBall();

    if (room_game.set) {
      while (room_game.set.p1.won === false &&
      room_game.set.p2.won === false) {
        this.gameService.updateGame(BallObj, room_game.set, this.game[room], this.server, room);
        this.server.in(room).emit('get_ball', BallObj.x, BallObj.y);
        await new Promise((f) => setTimeout(f, 8));
      }
    }
  }

  @SubscribeMessage('resizeIngame')
  async resizeIngame(
    @MessageBody() room: string,
  ) {
    const room_game = this.game[room];
    if (!room_game)
      return;
    this.server.in(room).emit('resize_game');
  }
}
