import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { BallEntity } from './game_entity/ball.entity';
import { GameEntity } from './game_entity/game.entity';
import { PaddleEntity } from './game_entity/paddle.entity';
import { PlayerEntity } from './game_entity/players.entity';
import { SetEntity } from './game_entity/set.entity';
import { GameService } from './game_service/game.service';

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
    private gameService: GameService,
  )
  {}

  @WebSocketServer() wws: Server;
  private logger: Logger = new Logger('GameGateway');
 

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  //////////////////////////////////////////////
  ////////////// SPECTATOR ROOM 
  ///////////////////////////////////////////////

  @SubscribeMessage('LeaveGameSpectator')
  async LeaveGameSpectator(client: Socket, room: string) {
    client.leave(room);
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (room_game) {
      room_game.spectator--;
      await this.all_game.save(room_game);
    }
  }

  /////////////////////////////////////////////

  @SubscribeMessage('Specthegame')
  async  Specthegame(client: Socket, room: string) {
    client.join(room);
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (room_game) {
      room_game.spectator++;
      await this.all_game.save(room_game);
      client.emit('startGame_spec', room_game);
    }
  }

  ////////////////////////////////////////////////
  //////////////// CREATE ROOM 
  ///////////////////////////////////////////////
  
  @SubscribeMessage('createGameRoom')
  async CreateRoom(client: Socket, room: string) {
    
    var room_game: GameEntity;
    if (room === '')
      room_game = await this.gameService.joinFastRoom(room);
    else
      room_game = await this.gameService.joinInvitation(room); 
  
    if (room_game) {
      if (room_game.nbr_co === 0) {
        room_game.nbr_co++;
        room_game.p1 = client.id;

        client.join(room_game.room_name);
        await this.all_game.save(room_game);

        client.emit('joinedRoom', room_game);
      } else if (room_game.nbr_co === 1) {
        room_game.nbr_co++;
        room_game.p2 = client.id;

        client.join(room_game.room_name);
        await this.all_game.save(room_game);

        client.to(room_game.room_name).emit('joinedRoom', room_game);
        client.emit('joinedRoom', room_game);
      } else if (room_game.nbr_co === 2)
        client.emit('fullRoom', room_game);
    }
  }
 
  ///////////////////////////////////////////////
  ////////  READY AND START GAME 
  //////////////////////////////////////////////

  @SubscribeMessage('readyGameMapPower')
   async Ready_map_power(client: Socket, data: any) {
    const room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    room_game.power = data.power;
    room_game.map = data.map;

    this.all_game.save(room_game);
    client.to(room).emit('Get_map_power', room_game);
  }

  @SubscribeMessage('readyGameRoom')
  async ReadyGame(client: Socket, room: string) {
    const room_game = await this.all_game.findOneBy({ room_name: room });


    if (room_game.p1 === client.id)
      room_game.p1_ready = true;
    else if (room_game.p2 === client.id)
      room_game.p2_ready = true;
    if (room_game.p2_ready === true && room_game.p1_ready === true) {
      room_game.game_started = true;
      room_game.thedate = new Date();
      ////send withc power and witch map before the second player 
      ////can touth ready and if player ready cant change power and map 
      client.emit('readyGame', room_game);
      client.to(room).emit('readyGame', room_game);
    } else
      client.to(room).emit('readyGame', room_game);
    return await this.all_game.save(room_game);
  }

  @SubscribeMessage('startGameRoom')
  async StartGame(client: Socket, room: string) {

    const room_game = await this.all_game.findOneBy({ room_name: room });


    if (!room_game.set) {
      room_game.set = new SetEntity();
    }
    if (!room_game.set.ball) {
      room_game.set.ball = new BallEntity();
    }
    if (!room_game.set.p1_paddle_obj) {
      room_game.set.p1_paddle_obj = new PaddleEntity();
    }
    if (!room_game.set.p2_paddle_obj) {
      room_game.set.p2_paddle_obj = new PaddleEntity();
    }
    if (!room_game.set.set_p1) {
      room_game.set.set_p1 = new PlayerEntity();
    }
    if (!room_game.set.set_p2) {
      room_game.set.set_p2 = new PlayerEntity();
    }
    room_game.set.set_p1.name = room_game.p1;
    room_game.set.set_p2.name = room_game.p2;

    room_game.spectator = 0;

    await this.all_game.save(room_game)
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
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game) 
      return;
    room_game.nbr_co -= 1;
    room_game.room_name = room;
    room_game.p2_ready = false;
    room_game.p1_ready = false;
    room_game.thedate = null;

    if (room_game.set) {
      if (room_game.set.set_p1) {
        room_game.set.set_p1.score = 0;
        room_game.set.set_p1.won = false;
        room_game.set.set_p1.name = 'null';
      }
      if (room_game.set.set_p2) {
        room_game.set.set_p2.score = 0;
        room_game.set.set_p2.won = false;
        room_game.set.set_p2.name = 'null';
      }
    }
    if (room_game.p1 === client.id) {
      room_game.p1 = room_game.p2;
      room_game.p2 = null;
    } else if (room_game.p2 === client.id)
      room_game.p2 = null;

    if (room_game.nbr_co === 0) {
      await this.all_game.remove(room_game);

      client.to(room).emit('leftRoomEmpty');
      client.emit('leftRoomEmpty');
      return;
    }
    await this.all_game.save(room_game);

    client.to(room).emit('leftRoom', room_game, client.id);
    client.emit('leftRoom', room_game, client.id);
  }

  ///////////////////////////////////////////////
  //////////////// PLAYER GIVE UP
  /////////////////////////////////////////////////

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client GAME disconnected: ${client.id}`);
    let room: string;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (room_game) {
      for (const [key, value] of Object.entries(room_game)) {
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
  }

  @SubscribeMessage('player_give_up')
  async PlayerGiveUp(client: Socket, room: string) {
    console.log("player_give_up");
    const room_game = await this.all_game.findOneBy({ room_name: room });


    client.leave(room);
    room_game.nbr_co -= 1;

    if (room_game.set.set_p1.name === client.id)
      room_game.set.set_p2.won = true;
    else if (room_game.set.set_p2.name === client.id)
      room_game.set.set_p1.won = true;
    if (room_game.spectator >= 1)
      client.to(room).emit('player_give_upem_spec', room_game);

    await this.all_game.save(room_game);
    client.emit('player_give_upem', room_game);
    client.to(room).emit('player_give_upem', room_game);
    client.emit('leftRoomEmpty', room_game, client.id);
  }

  @SubscribeMessage('end_of_the_game')
  async EndOfTheGame(client: Socket, room: string) {
    console.log("end_of_the_game");
    client.leave(room);
    const room_game = await this.all_game.findOneBy({ room_name: room });


    if (room_game) {
      await this.all_game.remove(room_game);
     // delete room_game;
    }
    client.emit('leftRoomEmpty');
    return;
  }

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA
  ///////////////////////////////////////////////

  @SubscribeMessage('paddleMouvLeft')
  async Paddle_mouv_left(client: Socket, data: any) {
    var room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });


    if (!room_game)
      return console.log(' paddleMouvRight !!!!! NO ROOM !!!! [' + room + ']');

    room_game.set.p1_paddle_obj.x = data.pd.x;
    room_game.set.p1_paddle_obj.y = data.pd.y;

    if (room_game.spectator >= 1 && client.id === room_game.p1) {
      client.to(room).emit('mouvPaddleLeft_spec', room_game);
    }
    client.emit('mouvPaddleLeft', room_game);
    client.to(room).emit('mouvPaddleLeft', room_game);
    return;
  }

  @SubscribeMessage('paddleMouvRight')
  async Paddle_mouv_right(client: Socket, data: any) {
    var room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game) {
      return console.log(' paddleMouvRight !!!!! NO ROOM !!!! [' + room + ']');
    }
    room_game.set.p2_paddle_obj.x = data.pd.x;
    room_game.set.p2_paddle_obj.y = data.pd.y;
    if (room_game.spectator >= 1 && client.id === room_game.p2) {
      client.to(room).emit('mouvPaddleRight_spec', room_game);
    }
    client.emit('mouvPaddleRight', room_game);
    client.to(room).emit('mouvPaddleRight', room_game);
    return;
  }

  ////////////////////////////////////////////////
  ////////////////  BALL DATA 
  ////////////////////////////////////////////////

  @SubscribeMessage('sincBall')
  async sinc_ball(client: Socket, data: any) {
    var room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });


    if (!room_game)
      return ;

    if (data.first === false) {
      room_game.set.ball.x = data.ball.x;
      room_game.set.ball.y = data.ball.y;
      
      room_game.set.ball.init_ball_pos = data.ball.init_ball_pos;
      room_game.set.ball.first_col = data.ball.first_col;

      room_game.set.ball.way_x = data.ball.ball_way_x;
      room_game.set.ball.way_y = data.ball.ball_way_y;

      // BALL NORMAL SPEED
      room_game.set.ball.ingame_dx = data.ball.ingame_dx;
      room_game.set.ball.ingame_dy = data.ball.ingame_dy;

      room_game.set.ball.first_dx = data.ball.first_dx;
      room_game.set.ball.first_dy = data.ball.first_dy;
      
      // POWER UP SPEED
      if (data.power === 1 || data.power === 3
      || data.power === 5 || data.power === 7) {
        room_game.set.ball.power_ingame_dx = data.ball.ingame_dx;
        room_game.set.ball.power_ingame_dy = data.ball.ingame_dy;

        room_game.set.ball.power_first_dx = data.ball.first_dx;
        room_game.set.ball.power_first_dy = data.ball.first_dy;
      }
      room_game.set.ball.rad = data.ball.rad;

      await this.all_game.save(room_game);
    }
    if (room_game.spectator >= 1)
      client.to(room).emit('sincTheBall_spec', room_game);
    //client.emit('sincTheBall', room_game);
    client.to(room).emit('sincTheBall', room_game);
  }

  ///////////////////////////////////////////////
  //////////////// Player DATA 
  ///////////////////////////////////////////////

  @SubscribeMessage('playerActyLeft')
  async Player_actu_left(client: Socket, data: any) {
    var room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game)
      return ;
    room_game.set.set_p1.score = data.score;
    room_game.set.set_p1.won = data.won;

    await this.all_game.save(room_game);
    if (room_game.spectator >= 1 && client.id === room_game.p1)
      client.to(room).emit('setDataPlayerLeft_spec', room_game);
    client.to(room).emit('setDataPlayerLeft', room_game);
    client.emit('setDataPlayerLeft', room_game);
    return;
  }

  @SubscribeMessage('playerActyRight')
  async Player_actu_right(client: Socket, data: any) {

    const room_game = await this.all_game.findOneBy({ room_name: room });

    var room = data.room;
    if (!room_game)
      return ;
    room_game.set.set_p2.score = data.score;
    room_game.set.set_p2.won = data.won;
    
    await this.all_game.save(room_game);
    if (room_game.spectator >= 1 && client.id === room_game.p2)
      client.to(room).emit('setDataPlayerRight_spec', room_game);
    client.to(room).emit('setDataPlayerRight', room_game);
    client.emit('setDataPlayerRight', room_game);
    return ;
  }
}