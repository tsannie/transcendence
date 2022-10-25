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
import { canvas_back_height, canvas_back_width, paddle_height, paddle_margin, paddle_width, rad } from './const/const';
import { BallCol_p1, BallCol_p2, mouv_ball } from './gamefunction';
import { BallEntity } from './game_entity/ball.entity';
import { RoomEntity } from './game_entity/room.entity';
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
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,
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
    
    let room_game: RoomEntity;


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

/*     room_game.power = data.power;
 */    room_game.map = data.map;

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

    console.log("PRETETTT NOTMw");
    if (room_game.p2_ready === true && room_game.p1_ready === true) {
      room_game.game_started = true;

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

    console.log("INNIT ALL ROOM= ", room)

    if (!room_game.set) {
      room_game.set = new SetEntity();
    }
    if (!room_game.set.ball) {
      room_game.set.ball = new BallEntity();
    }
    if (!room_game.set.p1_paddle_obj) {
      room_game.set.p1_paddle_obj = new PaddleEntity();
      room_game.set.p1_paddle_obj.x = paddle_margin;
      room_game.set.p1_paddle_obj.width = paddle_width;
      room_game.set.p1_paddle_obj.height = paddle_height;
    }
    if (!room_game.set.p2_paddle_obj) {
      room_game.set.p2_paddle_obj = new PaddleEntity();
      room_game.set.p2_paddle_obj.x = canvas_back_width - paddle_margin - paddle_width;
      room_game.set.p2_paddle_obj.width = paddle_width;
      room_game.set.p2_paddle_obj.height = paddle_height; 
    }
    if (!room_game.set.set_p1) {
      room_game.set.set_p1 = new PlayerEntity();
      room_game.set.set_p1.name = room_game.p1;
    }
    if (!room_game.set.set_p2) {
      room_game.set.set_p2 = new PlayerEntity();
      room_game.set.set_p2.name = room_game.p2;
    }

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
/*     room_game.date = null;
 */
    if (room_game.set) {
      if (room_game.set.set_p1) {
        room_game.set.set_p1.score = 0;
        room_game.set.set_p1.name = 'null';
      }
      if (room_game.set.set_p2) {
        room_game.set.set_p2.score = 0;
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
      room = room_game.room_name;
      if ((room_game.p1 === client.id || room_game.p2 === client.id) && room_game.game_started === false)
        this.LeaveRoom(client, room);
      if (room_game.p1 === client.id && room_game.nbr_co === 2 && room_game.game_started === true)
        this.PlayerGiveUp(client, room);
      else if (room_game.p2 === client.id && room_game.nbr_co === 2 && room_game.game_started === true)
        this.PlayerGiveUp(client, room); 
      else if (room_game.p1 === client.id || room_game.p2 === client.id)
        this.EndOfTheGame(client, room);
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
    client.emit('player_give_upem', room_game.set);
    client.to(room).emit('player_give_upem', room_game.set);
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

  @SubscribeMessage('paddleMouv')
  async Paddle_mouv(client: Socket, data: any) {
    const room_game = await this.all_game.findOneBy({ room_name: data.room });
    if (!room_game)
      return console.log(' paddleMouv !!!!! NO ROOM !!!! [' + data.room + ']');

      console.log("data.paddle_pos : " + data.paddle_y);
      if (data.im_p2 === true)
        room_game.set.p2_paddle_obj.y = (data.paddle_y * canvas_back_height) / data.front_canvas_height;
      else
        room_game.set.p1_paddle_obj.y = (data.paddle_y * canvas_back_height) / data.front_canvas_height;
      
        await this.all_game.save(room_game);
      client.emit('get_the_paddle', room_game.set);
      client.to(data.room).emit('get_the_paddle', room_game.set);
      
     //if (room_game.set.ball.x + (rad) >= room_game.set.p2_paddle_obj.x ||
    //room_game.set.ball.x - (rad) <= room_game.set.p1_paddle_obj.x + paddle_width) {
     // console.log("paddleMouv saveds");

   // }
    return;
  }

  @SubscribeMessage('paddleMouv_time')
  async paddleMouv_time(client: Socket, data: any) {
    const room_game = await this.all_game.findOneBy({ room_name: data.room });
    if (!room_game)
      return console.log(' paddleMouv !!!!! NO ROOM !!!! [' + data.room + ']');

      if (data.im_p2 === true)
        room_game.set.p2_paddle_obj.y = (data.paddle_y * canvas_back_height) / data.front_canvas_height;
      else
        room_game.set.p1_paddle_obj.y = (data.paddle_y * canvas_back_height) / data.front_canvas_height;

        client.emit('get_the_paddle', room_game.set);
        client.to(data.room).emit('get_the_paddle', room_game.set);
    
      //console.log("TIME paddleMouv saveds");
      await this.all_game.save(room_game);
    return;
  }
/*
/* 
  @SubscribeMessage('change_size_player_p2')
  async change_size_player_p2(client: Socket, data: any) {
    let room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game) {
      return console.log(' GET SIZE CHAN !!!!! NO ROOM !!!! [' + room + ']');
    }
    console.log("GET SIZE CHANGED");

   // room_game.set.p2_paddle_obj.x = data.canvas_width - 40;
    await this.all_game.save(room_game);
    client.to(room).emit('get_the_ball', room_game);
    client.emit('get_the_ball', room_game);
    return;
  }

  @SubscribeMessage('change_size_player_p1')
  async change_size_player_p1(client: Socket, data: any) {
    let room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (room_game.canvas_height === 0)
      room_game.canvas_height = data.canvas_height;
    if (room_game.canvas_width === 0)
      room_game.canvas_width = data.canvas_width;

    if (!room_game) {
      return console.log(' GET SIZE CHAN !!!!! NO ROOM !!!! [' + room + ']');
    }
    console.log("GET SIZE CHANGED");

    room_game.set.p1_paddle_obj.x = 20;
    await this.all_game.save(room_game);
    return;
  } */

  ////////////////////////////////////////////////
  ////////////////  BALL DATA 
  ////////////////////////////////////////////////

/*   @SubscribeMessage('sincBall')
  async sinc_ball(client: Socket, data: any) {
    let room = data.room;
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
  } */

  ///////////////////////////////////////////////
  //////////////// Player DATA 
  ///////////////////////////////////////////////

  @SubscribeMessage('playerActyLeft')
  async Player_actu_p1(client: Socket, data: any) {
    let room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game)
      return ;
    room_game.set.set_p1.score = data.score;
    room_game.set.set_p1.won = data.won;

    await this.all_game.save(room_game);
    if (room_game.spectator >= 1 && client.id === room_game.p1)
      client.to(room).emit('setDataP1_spec', room_game);
    client.to(room).emit('setDataP1', room_game);
    client.emit('setDataP1', room_game);
    return;
  }

  @SubscribeMessage('playerActyRight')
  async Player_actu_p2(client: Socket, data: any) {

    let room = data.room;
    const room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game)
      return ;
    room_game.set.set_p2.score = data.score;
    room_game.set.set_p2.won = data.won;
    
    await this.all_game.save(room_game);
    if (room_game.spectator >= 1 && client.id === room_game.p2)
      client.to(room).emit('setDataP2_spec', room_game);
    client.to(room).emit('setDataP2', room_game);
    client.emit('setDataP2', room_game);
    return ;
  }

  ///////////////////////////////////////////////
  ////////////// SINC ALL GAME AT ALL TIM
  ///////////////////////////////////////////////


  @SubscribeMessage('get_the_ball')
  async get_the_ball(client: Socket, room: string) {
    let room_game = await this.all_game.findOneBy({ room_name: room });

    if (!room_game)
    {console.log("NO ROOM GAME |", room, "|")
    return ;
  }
  //console.log("room==========", room);
  // console.log("SEND THE GAME");
  //room_game.set.set_p1.score = data.score;
  //console.log("room_Game.set.p1_paddle_obj.x = " + room_game.set.p1_paddle_obj.x);
  //console.log("room_Game.set.p2_paddle_obj.y = " + room_game.set.p2_paddle_obj.y);
  
  //console.log("im right = ", data.im_p2);
    //while (1) {
      room_game = await this.all_game.findOneBy({ room_name: room });
      
     // console.log ("--room_game.set.p2_paddle_obj.y", room_game.set.p2_paddle_obj.y);
      if (room_game.set) {
      if (room_game.set.ball) {

          mouv_ball(room_game.set);

          BallCol_p1(room_game.set);

          BallCol_p2(room_game.set);
          
         // client.emit('get_the_score', room_game);

          client.emit('get_the_ball', room_game.set);
          await this.all_game.save(room_game);
        }
        else
        console.log("no ball")
      } 
      else
      console.log("NO set");
    //}
      //console.log("xx");
    //BallMouv(ctx, gameSpecs, ballObj, canvas.height, canvas.width, power);
    //BallCol_p1(ctx, gameSpecs, player_p2, ballObj, paddleProps_p1, canvas.height, canvas.width);
    //BallCol_p2(ctx, gameSpecs, player_p1, ballObj, paddleProps_p2, canvas.height, canvas.width);
    //console.log("emit boucle")  
    //client.to(room).emit('send_the_game', room_game.set);
    //client.emit('send_the_game', room_game.set);
  }qweq

  @SubscribeMessage('resize_ingame')
  async resize_ingame(client: Socket, room: string) {
    const room_game = await this.all_game.findOneBy({ room_name: room });
    if (!room_game){
      console.log("NO ROOM GAME", room)
      return ;
    }
    client.emit('get_the_ball', room_game.set);
  }
}