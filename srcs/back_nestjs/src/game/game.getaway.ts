import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { from, throwError } from 'rxjs';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { BallEntity, GameEntity, PadleEntity, PlayerEntity, SetEntity } from './game_entity/game.entity';

//import { GameService } from './game_service/game_service.service';

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayInit {
  constructor(
    @InjectRepository(GameEntity)
    private all_game: Repository<GameEntity>, //private roomService: RoomService
  ) {}

  @WebSocketServer() wws: Server;
  private logger: Logger = new Logger('GameGateway');
  fast_room = 1;
  roo = new Map<string, GameEntity>();

  rooms = new Map<string, number>();

  afterInit(server: any) {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('createGameRoom')
  CreateRoom(client: Socket, room: string) {
    //console.log("ROOM NAME = [" + room + "]");
    if (room == '') {
      //console.log("=============");
      for (const [key, value] of Object.entries(this.roo)) {
        if (value.fast_play == true && value.nbr_co != 2)
          room = value.room_name;
        // console.log("room found = [" + room + "]");
      }//
      //console.log("=============");

      if (!this.roo[room]) {
        var theroom = new GameEntity();
        theroom.fast_play = true;
        room = makeid(4);
        this.roo[room] = theroom;
      }
    }
    client.join(room);
    //console.log(client.id);

    if (!this.rooms[room] || this.rooms[room] == 0) {
      this.rooms[room] = 1;
      if (!this.roo[room]) var theroom = new GameEntity();
      else var theroom = this.roo[room];

      theroom.room_name = room;
      theroom.nbr_co = 1;
      theroom.p1 = client.id;

      //console.log(`--back--User create room [${room}] |${this.rooms[room]}|`);////
      client.emit('joinedRoom', theroom);
      this.roo[room] = theroom;
      return this.all_game.save(theroom); //
    } else if (this.rooms[room] == 1) {
      this.rooms[room] += 1;

      const theroom = this.roo[room];
      theroom.nbr_co = 2;
      theroom.room_name = room;
      theroom.p2 = client.id;


      client.to(room).emit('joinedRoom', theroom);
      client.emit('joinedRoom', theroom);
      return this.all_game.save(theroom);
    } else if (this.rooms[room] == 2) {
      client.emit('roomFull', theroom);
    }
  }

  @SubscribeMessage('leaveGameRoom')
  LeaveRoom(client: Socket, room: string) {
    this.rooms[room] -= 1;
    client.leave(room);

    const theroom = this.roo[room];
    theroom.nbr_co -= 1;
    theroom.room_name = room;
    theroom.p2_ready = false;
    theroom.p1_ready = false;
    //theroom.read = false;
    this.roo[room].thedate = null;
    //theroom.game_started = false;


    if (theroom.p1 == client.id) {
      theroom.p1 = theroom.p2;
      theroom.p2 = null;
    } else if (theroom.p2 == client.id) theroom.p2 = null;

    client.to(room).emit('leftRoom', theroom);
    client.emit('leftRoom', theroom);

    this.roo[room] = theroom;
    if (theroom.nbr_co == 0) {
      //theroom.fast_play = false;
      //this.roo[room] = theroom;
      //console.log("nbr de co : " + theroom.nbr_co);
      //this.all_game.save(theroom);
      this.roo.delete(room);
      this.all_game.delete(theroom);
    }
    return this.all_game.save(theroom);
  }

  @SubscribeMessage('readyGameRoom')
  ReadyGame(client: Socket, room: string) {
    const theroom = this.roo[room];
    if (theroom.p1 == client.id)
      theroom.p1_ready = true;
    else if (theroom.p2 == client.id)
      theroom.p2_ready = true;
    if (theroom.p2_ready == true && theroom.p1_ready == true)
    {
      this.roo[room].game_started = true;
      this.roo[room].thedate = new Date();



      //console.log("===[" + theroom.set.ball.color + "]");
     //ball.color = "red";

///////


      client.emit('readyGame', theroom);
      client.to(room).emit('readyGame', theroom);
      console.log("DAAATE = " + this.roo[room].thedate);
    }
    else
      client.to(room).emit('readyGame', theroom);
    //else
      //this.roo[room].thedate = null;//
    return this.all_game.save(theroom);
  }
//////
@SubscribeMessage('startGameRoom')
StartGame(client: Socket, room: string) {
  
  console.log("START GAME ROOM = [" + room );//"] [" + x +"]");
  
  if (!this.roo[room].set)
    this.roo[room].set = new SetEntity();
  if (!this.roo[room].set.ball)
    this.roo[room].set.ball = new BallEntity();

  if (!this.roo[room].set.set_p1)
    this.roo[room].set.set_p1 = new PlayerEntity()
  if (!this.roo[room].set.set_p2)
    this.roo[room].set.set_p2 = new PlayerEntity()

  this.roo[room].set.set_p1.name = this.roo[room].p1;
  this.roo[room].set.set_p2.name = this.roo[room].p2;


   // this.roo[room].set.ball.x = x;
   // console.log("XXX = " + this.roo[room].set.ball.x)
    
/*     if (this.roo[room].set.ball.x >= 800)
      this.roo[room].set.ball.right = false;  
    if (this.roo[room].set.ball.x <= 0)
      this.roo[room].set.ball.right = true; */
    //this.all_game.save(this.roo[room]);

    client.to(room).emit('startGame', this.roo[room]);
    client.emit('startGame', this.roo[room]);
    return this.all_game.save(this.roo[room]);
  }

//
 @SubscribeMessage('paddleMouv')
Paddle_mouv(client: Socket, data: any) {



  console.log("PADDLE MOUVED [" + data.rom + "]=======================================================" );//"] [" + x +"]");
  var room = data.rom;
/*   if (!this.roo[room].set)
    this.roo[room].set = new SetEntity();
  if (!this.roo[room].set.p1_padle_obj) {
    this.roo[room].set.p1_padle_obj = new PadleEntity()
  }
  if (!this.roo[room].set.p2_padle_obj) {
    this.roo[room].set.p2_padle_obj = new PadleEntity()
  }
  this.roo[room].set.p2_padle_obj.height = p1paddle.height;
  this.roo[room].set.p2_padle_obj.width = p1paddle.width;
  this.roo[room].set.p2_padle_obj.color = p1paddle.color;
  this.roo[room].set.p2_padle_obj.x = p1paddle.x;
  this.roo[room].set.p2_padle_obj.y = p1paddle.y;

  this.roo[room].set.p2_padle_obj.height = p1paddle.height;
  this.roo[room].set.p2_padle_obj.width = p1paddle.width;
  this.roo[room].set.p2_padle_obj.color = p1paddle.color;
  this.roo[room].set.p2_padle_obj.x = p1paddle.x;
  this.roo[room].set.p2_padle_obj.y = p1paddle.y; */




   // this.roo[room].set.ball.x = x;
   // console.log("XXX = " + this.roo[room].set.ball.x)
    
/*     if (this.roo[room].set.ball.x >= 800)
      this.roo[room].set.ball.right = false;  
    if (this.roo[room].set.ball.x <= 0)
      this.roo[room].set.ball.right = true; */
    //this.all_game.save(this.roo[room]);

    client.to(room).emit('startGame', this.roo[room]);
    client.emit('startGame', this.roo[room]);
    return this.all_game.save(this.roo[room]);
  }
/////////
  /////////////////////////////////INGAME//
///////.//
  game_time = new Date;
  game_start = false;
//
  @SubscribeMessage('startTimerRoom')
  Start_timer(client: Socket, room: string) {
   // console.log("room " + room);
   // console.log("this.roo[room].game_started = " + this.roo[room].game_started);
    //      
    //console.log("1");
//
  if (this.roo[room].game_started == true) {
    if (!this.roo[room].thedate) {
        this.roo[room].thedate = new Date();
      }
      var tt = new Date()
      //console.log("12");
      var bb =  tt.getTime() - this.roo[room].thedate.getTime();
      
       this.roo[room].timer = new Date(bb);

      //console.log("13");

      client.to(room).emit('startTimer', this.roo[room]);
      client.emit('startTimer', this.roo[room]);


////
      //console.log("14");

      //this.all_game.save(this.roo[room]);
  }
  }
////
}
