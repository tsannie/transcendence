import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import {
  BallEntity,
  GameEntity,
  PaddleEntity,
  PlayerEntity,
  SetEntity,
} from './game_entity/game.entity';


@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayInit {
  constructor(
    @InjectRepository(GameEntity)
    private all_game: Repository<GameEntity>,
  ) {}

  @WebSocketServer() wws: Server;
  private logger: Logger = new Logger('GameGateway');

  fast_room = 1;
  roo = new Map<string, GameEntity>();
  rooms = new Map<string, number>();

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  ///////////////////////////////////////////////
  //////////////// CREATE ROOM 
  ///////////////////////////////////////////////


  @SubscribeMessage('createGameRoom')
  CreateRoom(client: Socket, room: string) {
    if (room === '') {
      for (const [key, value] of Object.entries(this.roo)) {
        if (value.fast_play === true && value.nbr_co !==2 && value.nbr_co !==0)
          room = value.room_name;
      }
      if (!this.roo[room]) {
        var theroom = new GameEntity();
        theroom.fast_play = true;
        room = randomUUID();
        
        this.roo[room] = theroom;
      }
    }
    client.join(room);

    if (!this.rooms[room] || this.rooms[room] === 0) {
      this.rooms[room] = 1;
      if (!this.roo[room]) var theroom = new GameEntity();
      else var theroom = this.roo[room];

      theroom.room_name = room;
      theroom.nbr_co = 1;
      theroom.p1 = client.id;

      client.emit('joinedRoom', theroom);
      this.roo[room] = theroom;
      return this.all_game.save(theroom);
    } else if (this.rooms[room] === 1) {
      this.rooms[room] += 1;

      const theroom = this.roo[room];
      theroom.nbr_co = 2;
      theroom.room_name = room;
      theroom.p2 = client.id;

      client.to(room).emit('joinedRoom', theroom);
      client.emit('joinedRoom', theroom);
      return this.all_game.save(theroom);
    } else if (this.rooms[room] === 2) {
      client.emit('roomFull', theroom);
    }
  }

  ///////////////////////////////////////////////
  //////////////// LEAVE ROOM 
  ///////////////////////////////////////////////

  @SubscribeMessage('leaveGameRoom')
  LeaveRoom(client: Socket, room: string) {
    this.rooms[room] -= 1;
    client.leave(room);
    this.roo[room].nbr_co -= 1;
    this.roo[room].room_name = room;
    this.roo[room].p2_ready = false;
    this.roo[room].p1_ready = false;
    this.roo[room].thedate = null;
    
    if (
      this.roo[room].set &&
      this.roo[room].set.set_p1 &&
      this.roo[room].set.set_p2
    ) {
      this.roo[room].set.set_p1.score = 0;
      this.roo[room].set.set_p1.won = false;
      this.roo[room].set.set_p1.name = 'null';

      this.roo[room].set.set_p2.score = 0;
      this.roo[room].set.set_p2.won = false;
      this.roo[room].set.set_p2.name = 'null';
    }
    if (this.roo[room].p1 === client.id) {
      this.roo[room].p1 = this.roo[room].p2;
      this.roo[room].p2 = null;
    } else if (this.roo[room].p2 === client.id) this.roo[room].p2 = null;

    if (this.roo[room].nbr_co === 0) {
      this.all_game.remove(this.roo[room]);
      delete this.roo[room];
      
      client.to(room).emit('leftRoomEmpty');
      client.emit('leftRoomEmpty');
      return;
    }
    this.all_game.save(this.roo[room]);
    client.to(room).emit('leftRoom', this.roo[room]);
    client.emit('leftRoom', this.roo[room]);
  }

  ///////////////////////////////////////////////
  ////////READY AND START GAME 
  ///////////////////////////////////////////////


  @SubscribeMessage('readyGameRoom')
  ReadyGame(client: Socket, room: string) {
    const theroom = this.roo[room];
    if (theroom.p1 === client.id) theroom.p1_ready = true;
    else if (theroom.p2 === client.id) theroom.p2_ready = true;
    if (theroom.p2_ready === true && theroom.p1_ready === true) {
      this.roo[room].game_started = true;
      this.roo[room].thedate = new Date();

      client.emit('readyGame', theroom);
      client.to(room).emit('readyGame', theroom);
      console.log('DAAATE = ' + this.roo[room].thedate);
    } else client.to(room).emit('readyGame', theroom);
    return this.all_game.save(theroom);
  }
  @SubscribeMessage('startGameRoom')
  StartGame(client: Socket, room: string) {
    console.log('START GAME ROOM = [' + room);

    if (!this.roo[room].set) this.roo[room].set = new SetEntity();
    if (!this.roo[room].set.ball) this.roo[room].set.ball = new BallEntity();

    if (!this.roo[room].set.set_p1)
      this.roo[room].set.set_p1 = new PlayerEntity();
    if (!this.roo[room].set.set_p2)
      this.roo[room].set.set_p2 = new PlayerEntity();

    this.roo[room].set.set_p1.name = this.roo[room].p1;
    this.roo[room].set.set_p2.name = this.roo[room].p2;

    this.roo[room].set.set_p1.score = 0;
    this.roo[room].set.set_p2.score = 0;

    this.roo[room].set.set_p1.score = false;
    this.roo[room].set.set_p2.score = false;

    client.to(room).emit('startGame', this.roo[room]);
    client.emit('startGame', this.roo[room]);
    return this.all_game.save(this.roo[room]);
  }


  ///////////////////////////////////////////////
  //////////////// INGAME ROOM 
  ///////////////////////////////////////////////


  ///////////////////////////////////////////////
  //////////////// PADDLE 
  ///////////////////////////////////////////////

  @SubscribeMessage('paddleMouvLeft')
  Paddle_mouv_left(client: Socket, data: any) {
    if (!this.roo[data.room]) {
      console.log(' !!!!! NO ROOM !!!! [' + data.room + ']');
      return;
    }
    var room = data.room;

    if (!this.roo[room].set.p1_padle_obj) {
      this.roo[room].set.p1_padle_obj = new PaddleEntity();
      this.roo[room].set.p1_padle_obj.width = data.pd.width;
      this.roo[room].set.p1_padle_obj.height = data.pd.height;
      this.roo[room].set.p1_padle_obj.color = data.pd.color;
    }
    this.roo[room].set.p1_padle_obj.x = data.pd.x;
    this.roo[room].set.p1_padle_obj.y = data.pd.y;

    this.all_game.save(this.roo[room]);
    client.emit('mouvPaddleLeft', this.roo[room]);
    client.to(room).emit('mouvPaddleLeft', this.roo[room]);
    return;
  }

  @SubscribeMessage('paddleMouvRight')
  Paddle_mouv_right(client: Socket, data: any) {
    if (!this.roo[data.room]) {
      console.log(' !!!!! NO ROOM !!!! [' + data.room + ']');
      return;
    }
    var room = data.room;

    if (!this.roo[room].set.p2_padle_obj) {
      this.roo[room].set.p2_padle_obj = new PaddleEntity();
      this.roo[room].set.p2_padle_obj.width = data.pd.width;
      this.roo[room].set.p2_padle_obj.height = data.pd.height;
      this.roo[room].set.p2_padle_obj.color = data.pd.color;
    }
    this.roo[room].set.p2_padle_obj.x = data.pd.x;
    this.roo[room].set.p2_padle_obj.y = data.pd.y;

    this.all_game.save(this.roo[room]);
    client.emit('mouvPaddleRight', this.roo[room]);
    client.to(room).emit('mouvPaddleRight', this.roo[room]);
    return;
  }

  ///////////////////////////////////////////////
  ////////////////  BALL 
  ///////////////////////////////////////////////

  @SubscribeMessage('sincBall')
  sinc_ball(client: Socket, data: any) {
    var room = data.room;

    if (!this.roo[room].set.ball) {
      this.roo[room].set.ball = new BallEntity();
    }
    this.roo[room].set.ball.x = data.ball.x;
    this.roo[room].set.ball.y = data.ball.y;
    this.roo[room].set.ball.ingame_dx = data.ball.ingame_dx;
    this.roo[room].set.ball.ingame_dy = data.ball.ingame_dy;

    this.roo[room].set.ball.init_dx = data.ball.init_dx;
    this.roo[room].set.ball.init_dy = data.ball.init_dy;

    this.roo[room].set.ball.init_first_dx = data.ball.init_first_dx;
    this.roo[room].set.ball.init_first_dy = data.ball.init_first_dy;

    this.roo[room].set.ball.first_dx = data.ball.first_dx;
    this.roo[room].set.ball.first_dy = data.ball.first_dy;

    this.roo[room].set.ball.init_ball_pos = data.ball.init_ball_pos;
    this.roo[room].set.ball.first_col = data.ball.first_col;

    client.emit('sincTheBall', this.roo[room]); 
    client.to(room).emit('sincTheBall', this.roo[room]);
  }

  ///////////////////////////////////////////////
  //////////////// Player DATA 
  ///////////////////////////////////////////////

  @SubscribeMessage('playerActyLeft')
  Player_actu_left(client: Socket, data: any) {
    var room = data.room;

    if (!this.roo[room]) {
      console.log(' !!!!! NO ROOM !!!! [' + room + ']');
      return;
    }

    if (!this.roo[room].set.set_p1)
      this.roo[room].set.set_p1 = new PlayerEntity();

    this.roo[room].set.set_p1.name = data.p.name;
    this.roo[room].set.set_p1.score = data.p.score;
    this.roo[room].set.set_p1.won = data.p.won;

    this.all_game.save(this.roo[room]);
    client.to(room).emit('setPlayerLeft', this.roo[room]);
    client.emit('setPlayerLeft', this.roo[room]);
    return;
  }

  @SubscribeMessage('playerActyRight')
  Player_actu_right(client: Socket, data: any) {
    var room = data.room;
    if (!this.roo[room]) {
      console.log(' !!!!! NO ROOM !!!! [' + room + ']');
      return;
    }

    if (!this.roo[room].set.set_p2)
      this.roo[room].set.set_p2 = new PlayerEntity();

    this.roo[room].set.set_p2.name = data.p.name;
    this.roo[room].set.set_p2.score = data.p.score;
    this.roo[room].set.set_p2.won = data.p.won;

    this.all_game.save(this.roo[room]);
    client.to(room).emit('setPlayerRight', this.roo[room]);
    client.emit('setPlayerRight', this.roo[room]);
    return;
  }
}
