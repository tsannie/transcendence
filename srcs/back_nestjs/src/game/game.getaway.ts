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
import { BallEntity, GameEntity, SetEntity } from './game_entity/game.entity';

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
      theroom.player_one = client.id;

      //console.log(`--back--User create room [${room}] |${this.rooms[room]}|`);
      client.emit('joinedRoom', theroom);
      this.roo[room] = theroom;
      return this.all_game.save(theroom); //
    } else if (this.rooms[room] == 1) {
      this.rooms[room] += 1;

      const theroom = this.roo[room];
      theroom.nbr_co = 2;
      theroom.room_name = room;
      theroom.player_two = client.id;

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
    theroom.player_two_ready = false;
    theroom.player_one_ready = false;
    theroom.read = false;
    this.roo[room].thedate = null;
    //theroom.game_started = false;


    if (theroom.player_one == client.id) {
      theroom.player_one = theroom.player_two;
      theroom.player_two = null;
    } else if (theroom.player_two == client.id) theroom.player_two = null;

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
    if (theroom.player_one == client.id)
      theroom.player_one_ready = true;
    else if (theroom.player_two == client.id)
      theroom.player_two_ready = true;
    if (theroom.player_two_ready == true && theroom.player_one_ready == true)
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
  
  console.log("ROOOOMMMMM = [" + room );//"] [" + x +"]");
  
  if (!this.roo[room].set)
    this.roo[room].set = new SetEntity();
  if (!this.roo[room].set.ball)
    this.roo[room].set.ball = new BallEntity();

   // this.roo[room].set.ball.x = x;
   // console.log("XXX = " + this.roo[room].set.ball.x)
    
    if (this.roo[room].set.ball.x >= 800)
      this.roo[room].set.ball.right = false;  
    if (this.roo[room].set.ball.x <= 0)
      this.roo[room].set.ball.right = true;

    client.to(room).emit('startGame', this.roo[room]);
    client.emit('startGame', this.roo[room]);
    return this.all_game.save(this.roo[room]);
  }
/////////
  /////////////////////////////////INGAME
///////
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
