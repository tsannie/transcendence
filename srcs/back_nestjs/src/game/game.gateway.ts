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
import { BallEntity } from './game_entity/ball.entity';
import { GameEntity } from './game_entity/game.entity';
import { PaddleEntity } from './game_entity/paddle.entity';
import { PlayerEntity } from './game_entity/players.entity';
import { SetEntity } from './game_entity/set.entity';

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
  )
  {}

  @WebSocketServer() wws: Server;
  private logger: Logger = new Logger('GameGateway');

  all_rooms = new Map<string, GameEntity>();
  rooms = new Map<string, number>();

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  ///////////////////////////////////////////////
  //////////////// SPECTATOR ROOM 
  ///////////////////////////////////////////////

  @SubscribeMessage('LeaveGameSpectator')
  async LeaveGameSpectator(client: Socket, room: string) {
    client.leave(room);
    if (this.all_rooms[room]) {
      this.all_rooms[room].spectator--;
      await this.all_game.save(this.all_rooms[room]);
    }
  }

  /////////////////////////////////////////////

  @SubscribeMessage('Specthegame')
  async  Specthegame(client: Socket, room: string) {
    client.join(room); //
    if (this.all_rooms[room]) {
      this.all_rooms[room].spectator++;
      await this.all_game.save(this.all_rooms[room]);
      client.emit('startGame_spec', this.all_rooms[room]);
    }
  }

  ////////////////////////////////////////////////
  //////////////// CREATE ROOM 
  ///////////////////////////////////////////////

  @SubscribeMessage('createGameRoom')
  async CreateRoom(client: Socket, room: string) {
    if (room === '') {
      for (const [key, value] of Object.entries(this.all_rooms)) {
        if (
          value.fast_play === true &&
          value.nbr_co !== 2 &&
          value.nbr_co !== 0
        )
          room = value.room_name;
      }
      if (!this.all_rooms[room]) {
        var theroom = new GameEntity();
        theroom.fast_play = true;
        room = randomUUID();
        this.all_rooms[room] = theroom;
      }
    }
    client.join(room);

    if (!this.rooms[room] || this.rooms[room] === 0) {
      this.rooms[room] = 1;
      if (!this.all_rooms[room])
        var theroom = new GameEntity();
      else
        var theroom = this.all_rooms[room];

      theroom.room_name = room;
      theroom.nbr_co = 1;
      theroom.p1 = client.id;

      client.emit('joinedRoom', theroom);
      this.all_rooms[room] = theroom;
      return await this.all_game.save(theroom);
    } else if (this.rooms[room] === 1) {
      this.rooms[room] += 1;

      const theroom = this.all_rooms[room];
      theroom.nbr_co = 2;
      theroom.room_name = room;
      theroom.p2 = client.id;

      client.to(room).emit('joinedRoom', theroom);
      client.emit('joinedRoom', theroom);
      return await this.all_game.save(theroom);
    } else if (this.rooms[room] === 2) {
      client.emit('roomFull', theroom);
    }
  }
 
  ///////////////////////////////////////////////
  ////////  READY AND START GAME 
  //////////////////////////////////////////////

  @SubscribeMessage('readyGameMapPower')
   Ready_map_power(client: Socket, data: any) {
    const room = data.room;

    this.all_rooms[room].power = data.power;
    this.all_rooms[room].map = data.map;

    this.all_game.save(this.all_rooms[room]);
    client.to(room).emit('Get_map_power', this.all_rooms[room]);
  }


  @SubscribeMessage('readyGameRoom')
  async ReadyGame(client: Socket, room: string) {
    if (this.all_rooms[room].p1 === client.id)
      this.all_rooms[room].p1_ready = true;
    else if (this.all_rooms[room].p2 === client.id)
      this.all_rooms[room].p2_ready = true;
    if (this.all_rooms[room].p2_ready === true && this.all_rooms[room].p1_ready === true) {
      this.all_rooms[room].game_started = true;
      this.all_rooms[room].thedate = new Date();
      //send withc power and witch map before the second player 
      //can touth ready and if player ready cant change power and map 
      client.emit('readyGame', this.all_rooms[room]);
      client.to(room).emit('readyGame', this.all_rooms[room]);
    } else
      client.to(room).emit('readyGame', this.all_rooms[room]);
    return await this.all_game.save(this.all_rooms[room]);
  }

  @SubscribeMessage('startGameRoom')
  async StartGame(client: Socket, room: string) {

    if (!this.all_rooms[room].set) {
      this.all_rooms[room].set = new SetEntity();
    }
    if (!this.all_rooms[room].set.ball) {
      this.all_rooms[room].set.ball = new BallEntity();
    }
    if (!this.all_rooms[room].set.p1_paddle_obj) {
      this.all_rooms[room].set.p1_paddle_obj = new PaddleEntity();
    }
    if (!this.all_rooms[room].set.p2_paddle_obj) {
      this.all_rooms[room].set.p2_paddle_obj = new PaddleEntity();
    }
    if (!this.all_rooms[room].set.set_p1) {
      this.all_rooms[room].set.set_p1 = new PlayerEntity();
    }
    if (!this.all_rooms[room].set.set_p2) {
      this.all_rooms[room].set.set_p2 = new PlayerEntity();
    }
    this.all_rooms[room].set.set_p1.name = this.all_rooms[room].p1;
    this.all_rooms[room].set.set_p2.name = this.all_rooms[room].p2;
    this.all_rooms[room].spectator = 0;

    await this.all_game.save(this.all_rooms[room])
  }

  ///////////////////////////////////////////////
  //////////////// INGAME ROOM
  ///////////////////////////////////////////////

  ///////////////////////////////////////////////
  //////////////// LEAVE ROOM 
  ///////////////////////////////////////////////

  @SubscribeMessage('leaveGameRoom')
  async LeaveRoom(client: Socket, room: string) {
    client.leave(room);
    if (!this.all_rooms[room]) 
      return;
    this.rooms[room] -= 1;
    this.all_rooms[room].nbr_co -= 1;
    this.all_rooms[room].room_name = room;
    this.all_rooms[room].p2_ready = false;
    this.all_rooms[room].p1_ready = false;
    this.all_rooms[room].thedate = null;

    if (this.all_rooms[room].set) {
      if (this.all_rooms[room].set.set_p1) {
        this.all_rooms[room].set.set_p1.score = 0;
        this.all_rooms[room].set.set_p1.won = false;
        this.all_rooms[room].set.set_p1.name = 'null';
      }
      if (this.all_rooms[room].set.set_p2) {
        this.all_rooms[room].set.set_p2.score = 0;
        this.all_rooms[room].set.set_p2.won = false;
        this.all_rooms[room].set.set_p2.name = 'null';
      }
    }
    if (this.all_rooms[room].p1 === client.id) {
      this.all_rooms[room].p1 = this.all_rooms[room].p2;
      this.all_rooms[room].p2 = null;
    } else if (this.all_rooms[room].p2 === client.id)
      this.all_rooms[room].p2 = null;

    if (this.all_rooms[room].nbr_co === 0) {
      await this.all_game.remove(this.all_rooms[room]);
      delete this.all_rooms[room];

      client.to(room).emit('leftRoomEmpty');
      client.emit('leftRoomEmpty');
      return;
    }
    await this.all_game.save(this.all_rooms[room]);

    client.to(room).emit('leftRoom', this.all_rooms[room], client.id);
    client.emit('leftRoom', this.all_rooms[room], client.id);
  }

  ///////////////////////////////////////////////
  //////////////// PLAYER GIVE UP
  /////////////////////////////////////////////////

  handleDisconnect(client: Socket) {
    this.logger.log(`Client GAME disconnected: ${client.id}`);
    let room: string;
    for (const [key, value] of Object.entries(this.all_rooms)) {
      room = value.room_name;
      if ((value.p1 === client.id || value.p2 === client.id) && value.game_started === false)
        this.LeaveRoom(client, room);
      if (value.p1 === client.id && value.nbr_co === 2 && value.game_started === true)
        this.PlayerGiveUp(client, room);
      else if (value.p2 === client.id && value.nbr_co === 2 && value.game_started === true)
        this.PlayerGiveUp(client, room); 
      else if (value.p1 === client.id || value.p2 === client.id)
        this.EndOfTheGame(client, room);
    }
  }

  @SubscribeMessage('player_give_up')
  async PlayerGiveUp(client: Socket, room: string) {
    console.log("player_give_up");
    this.rooms[room] = 0;
    client.leave(room);
    this.all_rooms[room].nbr_co -= 1;

    if (this.all_rooms[room].set.set_p1.name === client.id)
      this.all_rooms[room].set.set_p2.won = true;
    else if (this.all_rooms[room].set.set_p2.name === client.id)
      this.all_rooms[room].set.set_p1.won = true;
    if (this.all_rooms[room].spectator >= 1)
      client.to(room).emit('player_give_upem_spec', this.all_rooms[room]);

    await this.all_game.save(this.all_rooms[room]);
    client.emit('player_give_upem', this.all_rooms[room]);
    client.to(room).emit('player_give_upem', this.all_rooms[room]);
    client.emit('leftRoomEmpty', this.all_rooms[room], client.id);
  }

  @SubscribeMessage('end_of_the_game')
  async EndOfTheGame(client: Socket, room: string) {
    console.log("end_of_the_game");
    client.leave(room);
    if (this.all_rooms[room]) {
      await this.all_game.remove(this.all_rooms[room]);
      delete this.all_rooms[room];
    }
    client.emit('leftRoomEmpty');
    return;
  }

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA //
  ///////////////////////////////////////////////

  @SubscribeMessage('paddleMouvLeft')
  async Paddle_mouv_left(client: Socket, data: any) {
    var room = data.room;
    if (!this.all_rooms[room])
      return console.log(' paddleMouvRight !!!!! NO ROOM !!!! [' + room + ']');

    this.all_rooms[room].set.p1_paddle_obj.x = data.pd.x;
    this.all_rooms[room].set.p1_paddle_obj.y = data.pd.y;

    if (this.all_rooms[room].spectator >= 1 && client.id === this.all_rooms[room].p1) {
      client.to(room).emit('mouvPaddleLeft_spec', this.all_rooms[room]);
    }
    client.emit('mouvPaddleLeft', this.all_rooms[room]);
    client.to(room).emit('mouvPaddleLeft', this.all_rooms[room]);
    return;
  }

  @SubscribeMessage('paddleMouvRight')
  async Paddle_mouv_right(client: Socket, data: any) {
    var room = data.room;
    if (!this.all_rooms[room]) {
      return console.log(' paddleMouvRight !!!!! NO ROOM !!!! [' + room + ']');
    }

  
    this.all_rooms[room].set.p2_paddle_obj.x = data.pd.x;
    this.all_rooms[room].set.p2_paddle_obj.y = data.pd.y;
    if (this.all_rooms[room].spectator >= 1 && client.id === this.all_rooms[room].p2) {
      client.to(room).emit('mouvPaddleRight_spec', this.all_rooms[room]);
    }
    client.emit('mouvPaddleRight', this.all_rooms[room]);
    client.to(room).emit('mouvPaddleRight', this.all_rooms[room]);
    return;
  }

  ////////////////////////////////////////////////
  ////////////////  BALL DATA ///
  ////////////////////////////////////////////////

  @SubscribeMessage('sincBall')
  async sinc_ball(client: Socket, data: any) {
    var room = data.room;
    if (!this.all_rooms[room])
      return ;

    if (data.first === false) {
        console.log("first sinc normalement")

      this.all_rooms[room].set.ball.x = data.ball.x;
      this.all_rooms[room].set.ball.y = data.ball.y;
      
      this.all_rooms[room].set.ball.ingame_dx = data.ball.ingame_dx;
      this.all_rooms[room].set.ball.ingame_dy = data.ball.ingame_dy;
/* 
      this.all_rooms[room].set.ball.init_dx = data.ball.init_dx;
      this.all_rooms[room].set.ball.init_dy = data.ball.init_dy;
      
      this.all_rooms[room].set.ball.init_first_dx = data.ball.init_first_dx;
      this.all_rooms[room].set.ball.init_first_dy = data.ball.init_first_dy; */

      this.all_rooms[room].set.ball.first_dx = data.ball.first_dx;
      this.all_rooms[room].set.ball.first_dy = data.ball.first_dy;
      
      this.all_rooms[room].set.ball.init_ball_pos = data.ball.init_ball_pos;
      this.all_rooms[room].set.ball.first_col = data.ball.first_col;

      // POWER UP SPEED
      this.all_rooms[room].set.ball.power_ingame_dx = data.ball.ingame_dx;
      this.all_rooms[room].set.ball.power_ingame_dy = data.ball.ingame_dy;

      this.all_rooms[room].set.ball.power_first_dx = data.ball.first_dx;
      this.all_rooms[room].set.ball.power_first_dy = data.ball.first_dy;
    }
    else {
        
    }
    await this.all_game.save(this.all_rooms[room]);
    if (this.all_rooms[room].spectator >= 1)
      client.to(room).emit('sincTheBall_spec', this.all_rooms[room]);
    client.emit('sincTheBall', this.all_rooms[room]);
    client.to(room).emit('sincTheBall', this.all_rooms[room]);
  }

  //////////////////////////////////////////////
  //////////////// Player DATA 
  ///////////////////////////////////////////////

  @SubscribeMessage('playerActyLeft')
  async Player_actu_left(client: Socket, data: any) {
    var room = data.room;

    if (!this.all_rooms[room])
      return ;
    this.all_rooms[room].set.set_p1.score = data.score;
    this.all_rooms[room].set.set_p1.won = data.won;

    await this.all_game.save(this.all_rooms[room]);
    if (this.all_rooms[room].spectator >= 1 && client.id === this.all_rooms[room].p1)
      client.to(room).emit('setDataPlayerLeft_spec', this.all_rooms[room]);
    client.to(room).emit('setDataPlayerLeft', this.all_rooms[room]);
    client.emit('setDataPlayerLeft', this.all_rooms[room]);
    return;
  }

  @SubscribeMessage('playerActyRight')
  async Player_actu_right(client: Socket, data: any) {

    var room = data.room;
    if (!this.all_rooms[room])
      return ;
    this.all_rooms[room].set.set_p2.score = data.score;
    this.all_rooms[room].set.set_p2.won = data.won;
    
    await this.all_game.save(this.all_rooms[room]);
    if (this.all_rooms[room].spectator >= 1 && client.id === this.all_rooms[room].p2)
      client.to(room).emit('setDataPlayerRight_spec', this.all_rooms[room]);
    client.to(room).emit('setDataPlayerRight', this.all_rooms[room]);
    client.emit('setDataPlayerRight', this.all_rooms[room]);
    return ;
  }
}