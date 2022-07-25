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
import { GameEntity, RoomEntity } from './game_entity/game.entity';

//import { GameService } from './game_service/game_service.service';


function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: '*',
  },
})


export class GameGateway implements OnGatewayInit
{
  constructor(
    @InjectRepository(GameEntity)
    private all_game: Repository<GameEntity>, //private roomService: RoomService
  ) {}
    
    @WebSocketServer() wws: Server;
    private logger: Logger = new Logger('GameGateway');
    ////
    fast_room = 1;
    ent_rooms = new Map<string, GameEntity>();

    rooms = new Map<string, number>();
    
    //roomm = Record<string,  my_object>
    //nbr_co = 0;
  //mymap:Map<string, my_object>
  
  //mymap.set(room, {2: " ": " "});
  initGame() {
    //this.all_game

    //    return this.tchatRepository.save(tchat);
}
  
  afterInit(server: any) {
    this.logger.log('Initialized');
  }
  ////
  
  
  @SubscribeMessage('createGameRoom')
  CreateRoom(client: Socket, room: string) {
    //console.log("room size+ " + this.rooms.size);
    //this.fast_room = 0;
    //if (this.fast_room == 0)
    //  this.fast_room = 0;
    //console.log("this.fast_room =  " + this.fast_room);
/* 
    if (room == "")
    {
      console.log("-----")
      for (const [key, value] of Object.entries(this.ent_rooms)) {
        console.log(value.room_name + " = " + value.player_one)

        if (value.room_name == value.player_one && value.nbr_co != 2)
          room = value.room_name;
      }
      console.log("-----")
      if (!this.ent_rooms[room]) {
        room = client.id;
        //const theroom = this.ent_rooms[room]
      }
  
    } */
    console.log("ROOM NAME = [" + room + "]");
    if (room == "")
    {

      console.log("=============");
      for (const [key, value] of Object.entries(this.ent_rooms)) { 
        if (value.fast_play == true && value.nbr_co != 2)
          room = value.room_name;
        console.log("room found = [" + room + "]");
      }
      console.log("=============");

      if (!this.ent_rooms[room]) {
        var theroom = new GameEntity();
        theroom.fast_play = true;
        room = makeid(4);
        this.ent_rooms[room] = theroom;
      }
    }
    client.join(room);
    console.log(client.id);

    
    //this.all_game.addRoom(theroom)//
    //  this.nbr_co += 1;
    if (!this.rooms[room] || this.rooms[room] == 0) {
      this.rooms[room] = 1;
      if (!this.ent_rooms[room])
        var theroom = new GameEntity();//
      else
        var theroom = this.ent_rooms[room]
     
      theroom.room_name = room;
      theroom.nbr_co = 1;//
      theroom.player_one = client.id;//
      
      console.log(`--back--User create room [${room}] |${this.rooms[room]}|`);
      client.emit('joinedRoom',theroom);
      this.ent_rooms[room] = theroom;
      return this.all_game.save(theroom);//
    } else if (this.rooms[room] == 1) {
      this.rooms[room] += 1;
      console.log(`@2222222222222222222222@`);

      const theroom = this.ent_rooms[room]

      theroom.nbr_co = 2;
      theroom.room_name = room;
      theroom.player_two = client.id;
      //theroom.player_one = this.all_game.findByName(room);
/*       if (!theroom.player_two)
else if (!theroom.player_one)
        theroom.player_one = client.id; */


      
      
      console.log(`--back--User join room [${room}] |${this.rooms[room]}|`);
      // my_obj.p2 = client.id;
      
      client.to(room).emit('joinedRoom', theroom);
      client.emit('joinedRoom', theroom);
      //client.to(room).emit('joinedRoom', this.rooms[room]);
      
      //////////
      this.logger.log(`--back--client join room ${room} |${this.rooms[room]}|`);
      return this.all_game.save(theroom);//
    } else if (this.rooms[room] == 2) {
      console.log("-- BACK ROOM FULL EMIT --")
      client.emit('roomFull', theroom);
      return;
    }
  }
    

  @SubscribeMessage('leaveGameRoom')
  LeaveRoom(client: Socket, room: string) {

    
    console.log('ROOM LEAVED = ' + room);


    this.rooms[room] -= 1;
    client.leave(room);

    const theroom = this.ent_rooms[room]

    console.log('nbr co was = ' + theroom.nbr_co);
    theroom.nbr_co -= 1;
    theroom.room_name = room;
    //theroom.player_one = this.all_game.findByName(room);
    theroom.player_two_ready = false;
    theroom.player_one_ready = false;
    
    if (theroom.player_one == client.id) {
      //theroom.player_one = null;
      theroom.player_one = theroom.player_two;
      theroom.player_two = null;
    }
    else if (theroom.player_two == client.id)
      theroom.player_two = null;
    //theroom.player_one = client.id;
    
    //console.log("should be true = " + theroom.fast_play)
    
    client.to(room).emit('leftRoom', theroom);
    client.emit('leftRoom', theroom);
////
    console.log('--back--he leaved in back room:' + room);
    this.ent_rooms[room] = theroom;
    if (theroom.nbr_co == 0)
    {
      //theroom.fast_play = false;
      //this.ent_rooms[room] = theroom;
      //console.log("nbr de co : " + theroom.nbr_co);
      //this.all_game.save(theroom);
      //this.ent_rooms.delete(room);
      //this.all_game.delete(theroom);
    }
    return (this.all_game.save(theroom));
  }//


  @SubscribeMessage('readyGameRoom')
  StartGame(client: Socket, room: string) {
    //this.rooms[room] -= 1;
    //client.leave(room);
    console.log("!!!!!!!!!!!!!!!!!!room = " + room)
    const theroom = this.ent_rooms[room]
    if (theroom.player_one == client.id)
      theroom.player_one_ready = true;
    else if (theroom.player_two == client.id)
      theroom.player_two_ready = true;
    //theroom.nbr_co -= 1;
    //theroom.room_name = room;
    //theroom.player_one = this.all_game.findByName(room);
    //if (theroom.player_one == client.id) {
      //theroom.player_one = null;
     // theroom.player_one = theroom.player_two;
      //theroom.player_two = null;
    //}
   // else if (theroom.player_two == client.id)
    //  theroom.player_two = null;
    //theroom.player_one = client.id;
    console.log("two : " + theroom.player_two_ready +
    " one : " + theroom.player_one_ready);

    client.to(room).emit('startGame', theroom);
    if (theroom.player_two_ready == true && theroom.player_one_ready == true)
      client.emit('startGame', theroom);


    //this.logger.log(`--back--client leaved room ${room} `);
    //console.log('--back--he leaved in back room:' + room);
    //if (theroom.nbr_co == 0)
    //{
     // console.log("nbr de co : " + theroom.nbr_co);
     // this.all_game.save(theroom);
     // return (this.all_game.delete(theroom));
    //}
    return (this.all_game.save(theroom));
  }
  //
  @SubscribeMessage('chatToServer')
  Message(
    client: Socket,
    message: { sender: string; room: string; message: string },
  ) {
    this.wws.emit('chatToClient', message);
  }

  @SubscribeMessage('message')
  MMessage(@MessageBody() message: string): void {
    this.wws.emit('message', message);
  }
}
