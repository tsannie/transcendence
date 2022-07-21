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
import { from } from 'rxjs';
import { Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { GameEntity, RoomEntity } from './game_entity/game.entity';

//import { GameService } from './game_service/game_service.service';


type my_object = {
  nbr_co?: number;
  p1?: string;
  p2?: string;
}
type objw = {
  nbr : number;
  p1? : string;
  p2? : string;
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
    ent_rooms = new Map<string, GameEntity>();

    rooms = new Map<string, number>();
    rooms_id = new Map<string, Array<string>>();
    
    AnObject: my_object;
    //roomm = Record<string,  my_object>
    //nbr_co = 0;
  //mymap:Map<string, my_object>
  
  mymap = new Map<string, my_object>()
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
      
      
      var obj = {
        "nbr" : this.rooms[room],
        "p1" : client.id,
        "p2" : "1"
      }
      this.rooms_id[room] = obj;
      console.log("xxx" + this.rooms_id[room] + "xxx")
      var bb = this.rooms_id[room];
      console.log("--" + bb.nbr + "-- " + bb.p1 + "--" + bb.p2)
      
      
      console.log(`--back--User create room [${room}] |${this.rooms[room]}|`);
      client.emit('joinedRoom', this.rooms_id[room], theroom);
      this.ent_rooms[room] = theroom;
      return this.all_game.save(theroom);//
    } else if (this.rooms[room] == 1) {
      this.rooms[room] += 1;
      console.log(`@2222222222222222222222@`);
      var bb = this.rooms_id[room];

      const theroom = this.ent_rooms[room]

      theroom.nbr_co = 2;
      theroom.room_name = room;
      //theroom.player_one = this.all_game.findByName(room);
      theroom.player_two = client.id;
    

      obj = {
        "nbr" : this.rooms[room],
        "p1" : client.id,
        "p2" : "2"
      }
      
      this.rooms_id[room] = obj;
      console.log("xxx" + this.rooms_id[room] + "xxx")
      var bb = this.rooms_id[room];
      console.log("--" + bb.nbr + "-- " + bb.p1 + "--" + bb.p2)
      
      
      console.log(`--back--User join room [${room}] |${this.rooms[room]}|`);
      // my_obj.p2 = client.id;
      
      client.to(room).emit('joinedRoom', theroom);
      client.emit('joinedRoom', theroom);
      //client.to(room).emit('joinedRoom', this.rooms[room]);
      
      //////////
      this.logger.log(`--back--client join room ${room} |${this.rooms[room]}|`);
      return this.all_game.save(theroom);//
    } else if (this.rooms[room] == 2) {
      //client.emit('roimIsFull', this.rooms[room]);
      return;
    }
  }
    

  @SubscribeMessage('leaveGameRoom')
  LeaveRoom(client: Socket, room: string) {
    this.rooms[room] -= 1;
    client.leave(room);
/*     var obj = {
      "nbr" : this.rooms[room],
      "p1" : "bb.p1",
      "p2" : client.id
    } */
    //this.rooms_id[room] = obj;
    const theroom = this.ent_rooms[room]

    theroom.nbr_co -= 1;
    theroom.room_name = room;
    //theroom.player_one = this.all_game.findByName(room);
    if (theroom.player_one == client.id)
      theroom.player_one = null;
    else if (theroom.player_two == client.id)
      theroom.player_two = null;
    //theroom.player_one = client.id;

    client.to(room).emit('leftRoom', theroom);
    //client.emit('leftRoom', this.rooms[room]);


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
