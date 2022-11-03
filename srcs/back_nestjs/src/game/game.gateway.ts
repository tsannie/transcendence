import { ConsoleLogger, Logger } from '@nestjs/common';
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
import { canvas_back_height, canvas_back_width, paddle_height, paddle_margin, paddle_width, rad, spawn_gravity, spawn_speed, speed } from './const/const';
import { BallCol_p1, BallCol_p2, mouv_ball } from './gamefunction';
import { BallEntity } from './game_entity/ball.entity';
import { RoomEntity, RoomStatus } from './game_entity/room.entity';
import { PaddleEntity } from './game_entity/paddle.entity';
import { PlayerEntity } from './game_entity/players.entity';
import { SetEntity } from './game_entity/set.entity';
import { GameService } from './game_service/game.service';
import { PaddleDto } from './dto/paddle.dto';
import { clearInterval } from 'timers';

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
export class GameGateway implements OnGatewayInit {
  constructor(
    @InjectRepository(RoomEntity)
    private all_game: Repository<RoomEntity>,

    @InjectRepository(SetEntity)
    private all_set: Repository<SetEntity>,

    @InjectRepository(PaddleEntity)
    private all_paddle: Repository<PaddleEntity>,

    @InjectRepository(BallEntity)
    private all_ball: Repository<BallEntity>,

    private gameService: GameService,
  )
  {}

  @WebSocketServer() wws: Server;
  private logger: Logger = new Logger('GameGateway');


  afterInit(server: any) {
    this.logger.log('Initialized');
  }


  paddle_pos = new Map<string, double_pos>();


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
      client.emit('StartGame_spec', room_game);
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

    console.log("room_game.status", room_game.status)
    if (room_game) {
      if (room_game.status === RoomStatus.EMPTY) {
        room_game.status = RoomStatus.WAITING;
        room_game.p1 = client.id;

        client.join(room_game.room_name);
        await this.all_game.save(room_game);

        client.emit('joinedRoom', room_game);
      } else if (room_game.status === RoomStatus.WAITING) {
        room_game.status = RoomStatus.PLAYING;
        room_game.p2 = client.id;

        client.join(room_game.room_name);
        await this.all_game.save(room_game);

        this.InitSet(client, room_game.room_name);
        
        client.to(room_game.room_name).emit('joinedRoom', room_game);
        client.emit('joinedRoom', room_game);
      } else if (room_game.status === RoomStatus.PLAYING)
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
      room_game.status = RoomStatus.PLAYING;

      ////send withc power and witch map before the second player
      ////can touth ready and if player ready cant change power and map
      client.emit('readyGame', room_game);
      client.to(room).emit('readyGame', room_game);
    } else
      client.to(room).emit('readyGame', room_game);
    return await this.all_game.save(room_game);
  }

  async InitSet(client: Socket, room: string) {

    const room_game = await this.all_game.findOneBy({ room_name: room });

    console.log("INNIT ALL ROOM= ", room)

    if (!room_game.set) {
      room_game.set = new SetEntity();
    }
    if (!room_game.set.ball) {
      room_game.set.ball = new BallEntity();
      room_game.set.ball.x = canvas_back_width / 2;
      room_game.set.ball.y = canvas_back_height / 2;
      room_game.set.ball.gravity = spawn_gravity;
      room_game.set.ball.direction_x = 1;
      room_game.set.ball.direction_y = 1;
      room_game.set.ball.rad = rad;
    }
    if (!room_game.set.p1_paddle) {
      room_game.set.p1_paddle = new PaddleEntity();
      room_game.set.p1_paddle.x = paddle_margin;
      room_game.set.p1_paddle.width = paddle_width;
      room_game.set.p1_paddle.height = paddle_height;
    }//
    if (!room_game.set.p2_paddle) {
      room_game.set.p2_paddle = new PaddleEntity();
      room_game.set.p2_paddle.x = canvas_back_width - paddle_margin - paddle_width;
      room_game.set.p2_paddle.width = paddle_width;
      room_game.set.p2_paddle.height = paddle_height;
    }
    if (!room_game.set.p1) {
      room_game.set.p1 = new PlayerEntity();
      room_game.set.p1.name = room_game.p1;
    }
    if (!room_game.set.p2) {
      room_game.set.p2 = new PlayerEntity();
      room_game.set.p2.name = room_game.p2;
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
    if (room_game.status === RoomStatus.WAITING || room_game.status === RoomStatus.CLOSED)
      room_game.status = RoomStatus.EMPTY;
    room_game.room_name = room;
    room_game.p2_ready = false;
    room_game.p1_ready = false;
/*     room_game.date = null;
 *///
    if (room_game.set) {
      if (room_game.set.p1) {
        room_game.set.p1.score = 0;
        room_game.set.p1.name = 'null';
      }
      if (room_game.set.p2) {
        room_game.set.p2.score = 0;
        room_game.set.p2.name = 'null';
      }
    }
    if (room_game.p1 === client.id) {
      room_game.p1 = room_game.p2;
      room_game.p2 = null;
    } else if (room_game.p2 === client.id)
      room_game.p2 = null;

    if (room_game.status === RoomStatus.EMPTY) {
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


      if (room_game.status === RoomStatus.WAITING || room_game.status === RoomStatus.CLOSED)
        {
          this.LeaveRoom(client, room);
        //  console.log("simple leave")
        }
      else if (room_game.status === RoomStatus.PLAYING) {
        this.PlayerGiveUp(client, room);
       // console.log("give up")
      }
////
      /*
      else if (room_game.p1 === client.id && room_game.status === RoomStatus.PLAYING && room_game.status === RoomStatus.PLAYING)
        this.PlayerGiveUp(client, room);
      else if (room_game.p2 === client.id && room_game.status === RoomStatus.PLAYING && room_game.status === RoomStatus.PLAYING)
        this.PlayerGiveUp(client, room);
      else if (room_game.p1 === client.id || room_game.p2 === client.id)
        this.EndOfTheGame(client, room); */
    }
  }

  @SubscribeMessage('player_give_up')
  async PlayerGiveUp(client: Socket, room: string) {
    console.log("player_give_up");
    const room_game = await this.all_game.findOneBy({ room_name: room });


    client.leave(room);
    if (room_game.status === RoomStatus.PLAYING)
      room_game.status = RoomStatus.CLOSED;

////
    if (room_game.set.p1.name === client.id)
      room_game.set.p2.won = true;
    else if (room_game.set.p2.name === client.id)
      room_game.set.p1.won = true;
    if (room_game.spectator >= 1)
      client.to(room).emit('player_give_upem_spec', room_game);

    await this.all_game.save(room_game);
    client.emit('player_give_upem', room_game.set, room_game.status);
    client.to(room).emit('player_give_upem', room_game.set, room_game.status);
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
/* 
  public  y1 = 0;
  public  y2 = 0;

  @SubscribeMessage('paddleMouv_time')
  async paddleMouv_time(client: Socket, data: PaddleDto) {
    const room_game = await this.all_game.findOneBy({ room_name: data.room });
    if (!room_game)
      return console.log(' paddleMouv !!!!! NO ROOM !!!! [' + data.room + ']');

      //console.log("data.paddle_pos : " + data.paddle_y);
      //console.log("data.im_p2 : " + data.im_p2);
      if(!room_game.set)
        return ;
      if (data.im_p2 === true)
        room_game.set.p2_paddle.y = (data.paddle_y * canvas_back_height) / data.front_canvas_height;
      else
        room_game.set.p1_paddle.y = (data.paddle_y * canvas_back_height) / data.front_canvas_height;

        //console.log("room_game.set.p1_paddle.y", room_game.set.p1_paddle.y);

        //if (room_game.spectator >= 1)
        //  client.to(data.room).emit('get_the_paddle_spec', room_game);

        client.emit('get_the_paddle', room_game.set);
        client.to(data.room).emit('get_the_paddle', room_game.set);

      //console.log("TIME paddleMouv saveds");
      await this.all_game.save(room_game);
    return;
  }
 */
  @SubscribeMessage('pad_p1')
  async pad(client: Socket, data: PaddleDto) {

    client.to(data.room).emit('pad_p1', (data.paddle_y * canvas_back_height) / data.front_canvas_height)
    if (!this.paddle_pos[data.room])
      this.paddle_pos[data.room] = { y1: 0, y2: 0 };
    this.paddle_pos[data.room] = {y1: (data.paddle_y * canvas_back_height) / data.front_canvas_height, y2: this.paddle_pos[data.room].y2};

  }

  @SubscribeMessage('pad_p2')
  async padright(client: Socket, data: PaddleDto) {
    client.to(data.room).emit('pad_p2',(data.paddle_y * canvas_back_height) / data.front_canvas_height);
    if (!this.paddle_pos[data.room])
      this.paddle_pos[data.room] = { y1: 0, y2: 0 };
    this.paddle_pos[data.room] = {y1: this.paddle_pos[data.room].y1, y2: (data.paddle_y * canvas_back_height) / data.front_canvas_height};
  }

  ///////////////////////////////////////////////
  //////////////// Player DATA 
  ///////////////////////////////////////////////

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
      if (room_game.set) {
      if (room_game.set.ball) {

      //console.log("\nball.x", room_game.set.ball.x);
     //// console.log("ball.y", room_game.set.ball.y);
//
          client.emit('get_the_ball', room_game.set.ball);
            await this.all_game.save(room_game);
        }
        else
        console.log("no ball")
      }
      else
      console.log("NO set");

  }

  @SubscribeMessage('get_ball')
   async getball(client: Socket, data: any) {
    const room_game = await this.all_game.findOneBy({ room_name: data.room });

     if (!room_game)
     return console.log(' getball !!!!! NO ROOM !!!! [' + data.room + ']');
     
     const ball = room_game.set.ball;
     if (room_game.set)
     {
       
       setInterval(() => {
         
        if (this.paddle_pos[data.room]) {
         room_game.set.p1_paddle.y = this.paddle_pos[data.room].y1;
         room_game.set.p2_paddle.y = this.paddle_pos[data.room].y2;
        }
         mouv_ball(room_game.set);
         if (ball.x + rad >= canvas_back_width + (rad * 3))
         {
           room_game.set.p1.score += 1;
           this.all_game.save(room_game);
           client.emit('get_players', room_game.set.p1, room_game.set.p2);
           client.to(data.room).emit('get_players', room_game.set.p1, room_game.set.p2);
         }
 
         if (ball.x - rad <= - (rad * 3))
         {
           room_game.set.p2.score += 1;
           this.all_game.save(room_game);
           client.emit('get_players', room_game.set.p1, room_game.set.p2);
           client.to(data.room).emit('get_players', room_game.set.p1, room_game.set.p2);
         }
         
         BallCol_p1(room_game.set);
         BallCol_p2(room_game.set);

          client.emit('get_ball', ball.x, ball.y);
          client.to(data.room).emit('get_ball', ball.x, ball.y);

          this.all_ball.save(ball);
        }, 25);
    //
      }
    return;
  }
  @SubscribeMessage('resize_ingame')
  async resize_ingame(client: Socket, room: string) {
    const room_game = await this.all_game.findOneBy({ room_name: room });
    if (!room_game){
      console.log("NO ROOM GAME", room)
      return ;
    }
    //client.emit('get_the_ball', room_game.set);
  }
}