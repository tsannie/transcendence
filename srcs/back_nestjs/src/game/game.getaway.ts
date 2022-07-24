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

    if (room == "")
    {
        console.log("=============");
        for (const [key, value] of Object.entries(this.ent_rooms)) { 
           // console.log("key = " + key + "\n value = " + value.room_name);
           // console.log("id = " + value.player_one + "\n nbr_co = " + value.nbr_co);
            if (value.room_name == value.player_one)
                room = value.room_name;
        }

       /*  this.ent_rooms.forEach((value: GameEntity, key: string) => {
            console.log(key, value);
        }); */
        //console.log("=============");

/*       if (!this.ent_rooms[room]) {
        var theroom = this.ent_rooms[room]
        console.log("\n\nif + " )
        theroom.nbr_co = 2;
       // this.fast_room = theroom.id;
      } */
      if (!this.ent_rooms[room]) {
        console.log("\n\nelse + " )//
       // var theroom = new GameEntity();
        //this.all_game.save(theroom);
        //theroom.nbr_co = 1;
        room = client.id;
        //theroom.player_one = client.id;
/*         console.log("id = " +  theroom.id);
        console.log("id = ", room);
        client.emit('joinedRoom',theroom);
        this.ent_rooms[room] = theroom;
        return this.all_game.save(theroom);// */
      }
      console.log("this.fast_room =  " + this.fast_room);
      //this.fast_room = this.fast_room;
      //if (this.fast_room != 0)
 //     theroom = this.ent_rooms[this.fast_room]
   
    }
      //  room = toString(this.rooms.size);

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
    this.rooms[room] -= 1;
    client.leave(room);

    const theroom = this.ent_rooms[room]

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

    client.to(room).emit('leftRoom', theroom);
    client.emit('leftRoom', theroom);


    this.logger.log(`--back--client leaved room ${room} `);
    console.log('--back--he leaved in back room:' + room);
    if (theroom.nbr_co == 0)
    {
      console.log("nbr de co : " + theroom.nbr_co);
      this.all_game.save(theroom);
      return (this.all_game.delete(theroom));
    }
    return (this.all_game.save(theroom));
  }


  @SubscribeMessage('readyGameRoom')
  StartGame(client: Socket, room: string) {
    //this.rooms[room] -= 1;
    //client.leave(room);

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
