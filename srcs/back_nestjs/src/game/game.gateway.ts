import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Console } from 'console';
import { randomUUID } from 'crypto';
import { Server } from 'http';
import { from, throwError } from 'rxjs';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { BallEntity } from './game_entity/ball.entity';
import { GameEntity } from './game_entity/game.entity';
import { PadleEntity } from './game_entity/padle.entity';
import { PlayerEntity } from './game_entity/players.entity';
import { ResumeEntity } from './game_entity/resume.entity';
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
  //////////////// SPECTATOR ROOM ////
  ///////////////////////////////////////////////


  //WORK IN PROGRESS !!! WORK IN PROGRESS !!! WORK IN PROGRESS !!!

  
  @SubscribeMessage('LeaveGameSpectator')
  LeaveGameSpectator(client: Socket, room: string) {
    console.log("BAAAAAAACK leaved room SPEC = [" + room + "]");
    client.leave(room);
    if (this.roo[room])
    {
      this.roo[room].spectator--;
      console.log("spectator = " + this.roo[room].spectator);
      this.all_game.save(this.roo[room]);
    }
  }

  /////////////////////////////////////////////
  /////////////////////////////////////////////

  @SubscribeMessage('Specthegame')
  Specthegame(client: Socket, room: string) {

    console.log ("\n\nBAAAAAAACK SPEC -=-=-=-[ " + room + " ]-=-=-=-=-")
    client.join(room); //
    if (this.roo[room])
    {
    //client.leave("lookroom");//

      //console.log("BAAAAAACK SPEC = [" + room + "]");

      this.roo[room].spectator++;
      this.all_game.save(this.roo[room]);
      console.log("12spectator joined = " + this.roo[room].spectator);

      //client.emit('change_status');
      client.emit('startGameSpec', this.roo[room]);
    }
    
  }

  ///////////////////////////////////////////////
  //////////////// CREATE ROOM /
  //////////////////////////////////////////////

  @SubscribeMessage('createGameRoom')
  CreateRoom(client: Socket, room: string) {
    //console.log("MERRRDE room = [" + room + "]");///
    if (room === '') {
      for (const [key, value] of Object.entries(this.roo)) {
        //console.log("\n value = " + value.room_name);//
        //console.log("\n co = \n" + value.nbr_co);//
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
  //////////////// LEAVE ROOM /
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
    
    if (this.roo[room].set &&
    this.roo[room].set.set_p1 &&
    this.roo[room].set.set_p2) {
  
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
    } else if (this.roo[room].p2 === client.id)
      this.roo[room].p2 = null;

    if (this.roo[room].nbr_co === 0) {
      this.all_game.remove(this.roo[room]);
      delete this.roo[room];
      
    
      client.to(room).emit('leftRoomEmpty');
      client.emit('leftRoomEmpty');
      return;
    }
    this.all_game.save(this.roo[room]);

    client.to(room).emit('leftRoom', this.roo[room], client.id);
    client.emit('leftRoom', this.roo[room], client.id);
  }

  ////////////////////////////////////////////////
  ////////READY AND START GAME//
  //////////////////////////////////////////////


  @SubscribeMessage('readyGameRoom')
  ReadyGame(client: Socket, room: string) {
    const theroom = this.roo[room];
    if (theroom.p1 === client.id)
      theroom.p1_ready = true;
    else if (theroom.p2 === client.id)
      theroom.p2_ready = true;
    if (theroom.p2_ready === true && theroom.p1_ready === true) {
      this.roo[room].game_started = true;
      this.roo[room].thedate = new Date();

      client.emit('readyGame', theroom);
      client.to(room).emit('readyGame', theroom);
      //console.log('DAAATE = ' + this.roo[room].thedate);////
    } else
      client.to(room).emit('readyGame', theroom);
    return this.all_game.save(theroom);
  }

  @SubscribeMessage('startGameRoom')
  StartGame(client: Socket, room: string) {
    console.log('START GAME ROOM = [' + room);

    console.log("-- ------------------ --");

    if (!this.roo[room].set)
      this.roo[room].set = new SetEntity();

    console.log("-- ------------------ --");
    if (!this.roo[room].set.ball)
    {
      //const ball = new BallEntity()
      // await dataSource.manager.save(resume)
      console.log("BUG ????")
      this.roo[room].set.ball = new BallEntity();
      console.log("BUG ????")

      //this.roo[room].set.ball = new BallEntity();
    }
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

    this.roo[room].spectator = 0;

    const resume = new ResumeEntity()
    // await dataSource.manager.save(resume)
    console.log("BUG ????")
    this.roo[room].resume = resume;
    
    
    this.roo[room].resume.name_player_win = "male"
    this.roo[room].resume.name_player_lose = "me.jpg"


    console.log("BUG ????")
    console.log("this.roo[room].resume = " + this.roo[room].resume.name_player_win)
    console.log("this.roo[room].resume = " + this.roo[room].resume.name_player_lose)
   // await dataSource.manager.save(user)
    
    return this.all_game.save(this.roo[room]);
  }


  ///////////////////////////////////////////////
  //////////////// INGAME ROOM 
  ///////////////////////////////////////////////

  ///////////////////////////////////////////////
  //////////////// PLAYER GIVE UP ////////
  ///////////////////////////////////////////////

  handleDisconnect(client: Socket) {
    this.logger.log(`Client GAME disconnected: ${client.id}`);

    let room: string;
    for (const [key, value] of Object.entries(this.roo)) {
      //console.log("\n value = " + value.room_name);//
      //console.log("\n co = \n" + value.nbr_co);//
      room = value.room_name;
      if (value.p1 === client.id && value.game_started === true) {
        console.log("123  ", value.room_name);
        //this.all_game.remove(this.roo[room]);
        //delete this.roo[room];
        this.PlayerGiveUp(client, room);
      }
      else if (value.p2 === client.id && value.game_started === true)
      {
        console.log("456  ", value.room_name);
        //this.all_game.remove(this.roo[room]);
        //delete this.roo[room];
        this.PlayerGiveUp(client, room);
      }
      else if (value.p1 === client.id || value.p2 === client.id)
      {
        console.log("789  ", value.room_name);
        this.LeaveRoom(client, room);
      }
    }
  }



  @SubscribeMessage('player_give_up')
  PlayerGiveUp(client: Socket, room: string) {
    this.rooms[room] = 0;
    client.leave(room);
    this.roo[room].nbr_co == 0;
    this.roo[room].game_started = false;

    //this.roo[room].room_name = room;
    //this.roo[room].p2_ready = false;
    //this.roo[room].p1_ready = false;
    
    if (this.roo[room].set.set_p1.name === client.id)
      this.roo[room].set.set_p2.won = true;
    else if (this.roo[room].set.set_p2.name === client.id)
      this.roo[room].set.set_p1.won = true;

    console.log("HOOO LE NULL player_give_up = " + client.id);
      //this.all_game.save(this.roo[room]);
      
    if (this.roo[room].spectator >= 1 ) {
      client.to(room).emit('player_give_upem_spec', this.roo[room]);
    }
    client.emit('player_give_upem', this.roo[room]);
    client.to(room).emit('player_give_upem', this.roo[room]);
    client.emit('leftRoomEmpty', this.roo[room], client.id);
    
    //spectator
    //client.to(room).emit('getAllGameRoom', this.roo);

    if (this.roo[room]) {
      this.all_game.remove(this.roo[room]);
      delete this.roo[room];
    }

/*     this.roo[room];




        if (this.roo[room].spectator >== 1 && client.id === this.roo[room].p1)

    {
      client.to(room).emit('player_give_upem_spec',
      this.roo[room]);
    } 
    client.emit('player_give_upem', this.roo[room]);
    client.to(room).emit('player_give_upem', this.roo[room]);
    client.to(room).emit('leftRoomEmpty', this.roo[room]);

    return this.all_game.save(this.roo[room]); */
  }
 
  @SubscribeMessage('end_of_the_game')
  EndOfTheGame(client: Socket, room: string) {

    client.leave(room);
    if (this.roo[room]) {
      this.all_game.remove(this.roo[room]);
      delete this.roo[room];
    }
    client.emit('leftRoomEmpty');
    return ;
  }
 

  ///////////////////////////////////////////////
  //////////////// PADDLE DATA/
  ////////////////////////////////////////////////

  @SubscribeMessage('paddleMouvLeft')
  Paddle_mouv_left(client: Socket, data: any) {
    if (!this.roo[data.room]) {
      return;
    }
    var room = data.room;

    if (!this.roo[room].set.p1_padle_obj) {
      this.roo[room].set.p1_padle_obj = new PadleEntity();
      this.roo[room].set.p1_padle_obj.width = data.pd.width;
      this.roo[room].set.p1_padle_obj.height = data.pd.height;
      this.roo[room].set.p1_padle_obj.color = data.pd.color;
    }
    this.roo[room].set.p1_padle_obj.x = data.pd.x;
    this.roo[room].set.p1_padle_obj.y = data.pd.y;

    this.all_game.save(this.roo[room]);

    //console.log("nbr_in_room_spec = " + this.nbr_in_room_spec);
    if (this.roo[room].spectator >= 1 && client.id === this.roo[room].p1)
    {
      client.to(room).emit('mouvPaddleLeft_spec',
      this.roo[room]);
    }

    client.emit('mouvPaddleLeft', this.roo[room]);
    client.to(room).emit('mouvPaddleLeft', this.roo[room]);
    return;
  }

  @SubscribeMessage('paddleMouvRight')
  Paddle_mouv_right(client: Socket, data: any) {
    if (!this.roo[data.room]) {
      console.log(' paddleMouvRight !!!!! NO ROOM !!!! [' + data.room + ']');
      return;
    }
    var room = data.room;
    if (!this.roo[room].set.p2_padle_obj) {
      this.roo[room].set.p2_padle_obj = new PadleEntity();
      this.roo[room].set.p2_padle_obj.width = data.pd.width;
      this.roo[room].set.p2_padle_obj.height = data.pd.height;
      this.roo[room].set.p2_padle_obj.color = data.pd.color;
    }
    this.roo[room].set.p2_padle_obj.x = data.pd.x;
    this.roo[room].set.p2_padle_obj.y = data.pd.y;

    this.all_game.save(this.roo[room]);
    if (this.roo[room].spectator >= 1 && client.id === this.roo[room].p2)
    {
      client.to(room).emit('mouvPaddleRight_spec',
      this.roo[room]);
    }
    client.emit('mouvPaddleRight', this.roo[room]);
    client.to(room).emit('mouvPaddleRight', this.roo[room]);
    return;
  }

  ///////////////////////////////////////////////
  ////////////////  BALL DATA //
  ///////////////////////////////////////////////

  @SubscribeMessage('sincBall')
  sinc_ball(client: Socket, data: any) {
    var room = data.room;
    if (!this.roo[room])
      return ;
    if (!this.roo[room].set.ball) {
      const ball = new BallEntity()
      this.roo[room].set.ball = ball;
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

    if (this.roo[room].spectator >= 1 && client.id === this.roo[room].p1)
    {
      client.to(room).emit('sincTheBall_spec', this.roo[room]);
    }
    //client.emit('sincTheBall', this.roo[room]); 
    client.to(room).emit('sincTheBall', this.roo[room]);
  }

  ////////////////////////////////////////////////
  //////////////// Player DATA //
  ////////////////////////////////////////////////

  @SubscribeMessage('playerActyLeft')
  Player_actu_left(client: Socket, data: any) {
    var room = data.room;

    //console.log("playerActyLeft BACK END");
    if (!this.roo[room]) {
      console.log('playerActyLeft !!!!! NO ROOM !!!! [' + room + ']');
      return;
    }

    if (!this.roo[room].set.set_p1)
      this.roo[room].set.set_p1 = new PlayerEntity();

      //console.log("playerActyrIGHT BACK END");
     // console.log("data.p.score = " + data.score);
      //console.log("data.p.won = " + data.won);///
      
    this.roo[room].set.set_p1.score = data.score;
    this.roo[room].set.set_p1.won = data.won;

    this.all_game.save(this.roo[room]);
    if (this.roo[room].spectator >= 1 && client.id === this.roo[room].p1)
    {
      client.to(room).emit('setDataPlayerLeft_spec',
      this.roo[room]);
    }

    client.to(room).emit('setDataPlayerLeft', this.roo[room]);
    client.emit('setDataPlayerLeft', this.roo[room]);
    return;
  }

  @SubscribeMessage('playerActyRight')
  Player_actu_right(client: Socket, data: any) {
  
    //console.log("playerActyrIGHT BACK END");
    //console.log("data.p.score = " + data.score);
    //console.log("data.p.won = " + data.won);


    var room = data.room;
    if (!this.roo[room]) {
      console.log('playerActyRight !!!!! NO ROOM !!!! [' + room + ']');
      return;
    }

    if (!this.roo[room].set.set_p2)
      this.roo[room].set.set_p2 = new PlayerEntity();


    this.roo[room].set.set_p2.score = data.score;
    this.roo[room].set.set_p2.won = data.won;

    this.all_game.save(this.roo[room]);
    if (this.roo[room].spectator >= 1 && client.id === this.roo[room].p2)
    {
      client.to(room).emit('setDataPlayerRight_spec',
      this.roo[room]);
    }
    client.to(room).emit('setDataPlayerRight', this.roo[room]);
    client.emit('setDataPlayerRight', this.roo[room]);
    return;
  }
}