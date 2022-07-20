import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { GameEntity } from './game_entity/game.entity';

type my_object = {
  nbr_co: number;

  p1: string;
  p2: string;
}


@WebSocketGateway({
  namespace: '/game',
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayInit {
  /*     constructor(
    @InjectRepository(GameEntity)
        private allMessages: Repository<GameEntity>, //private roomService: RoomService
      ) {} */

  @WebSocketServer() wws: Server;

  private logger: Logger = new Logger('GameGateway');
  ////
  rooms = new Map<string, number>();
  //nbr_co = 0;

  afterInit(server: any) {
    this.logger.log('Initialized');
  }
  ////
  @SubscribeMessage('createGameRoom')
  CreateRoom(client: Socket, room: string) {
    client.join(room);
    console.log(client.id);
    var my_obj : my_object;
    //  this.nbr_co += 1;
    if (!this.rooms[room] || this.rooms[room] == 0) {
      this.rooms[room] = 1;

     // my_obj.nbr_co = this.rooms[room];
      //my_obj.p1 = client.id;
      console.log(`--back--User create room [${room}] |${this.rooms[room]}|`);
      client.emit('joinedRoom', this.rooms[room], client.id, "");
    } else if (this.rooms[room] == 1) {
      this.rooms[room] += 1;

      console.log(`--back--User join room [${room}] |${this.rooms[room]}|`);

      client.to(room).emit('joinedRoom', this.rooms[room], "", client.id);
      client.emit('joinedRoom', this.rooms[room], "", client.id);
      //client.to(room).emit('joinedRoom', this.rooms[room]);

      //////////
      this.logger.log(`--back--client join room ${room} |${this.rooms[room]}|`);
    } else if (this.rooms[room] == 2) {
      //client.emit('roimIsFull', this.rooms[room]);
      return;
    }
  }
    

  @SubscribeMessage('leaveGameRoom')
  LeaveRoom(client: Socket, room: string) {
    this.rooms[room] -= 1;
    client.leave(room);
    client.to(room).emit('leftRoom', this.rooms[room]);
    //client.emit('leftRoom', this.rooms[room]);

    this.logger.log(`--back--client leaved room ${room} `);
    console.log('--back--he leaved in back room:' + room);
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
