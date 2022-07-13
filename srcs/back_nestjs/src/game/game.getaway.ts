import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'http';
import { Socket } from 'socket.io';
import { GameEntity } from './game_entity/game.entity';

@WebSocketGateway ({
    namespace: '/game',
    cors: {
      origin: '*',
    },
  })

  export class GameGateway
  implements OnGatewayInit
  {
/*     constructor(
    @InjectRepository(GameEntity)
        private allMessages: Repository<GameEntity>, //private roomService: RoomService
      ) {} */

      @WebSocketServer() wws: Server;
      
    private logger: Logger = new Logger('GameGateway')
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
    //  this.nbr_co += 1;
      if (!this.rooms[room])
        this.rooms[room] = 1;
      else
        this.rooms[room] += 1;
      console.log(`--back--User join room [${room}] |${this.rooms[room]}|`);
      
      //
      client.to(room).emit('joinedRoom', this.rooms[room]);
      //////////
      
      //this.logger.log(`--back--client join room ${room} |${this.rooms[room]}|`);
      //this.logger.log(this.nbr_co);
    }
    //
    @SubscribeMessage('leaveGameRoom')
    LeaveRoom(client: Socket, room: string) {
      client.leave(room)
     
      this.rooms[room] -= 1;
      client.to(room).emit('leftRoom', this.rooms[room]);
      
      
      this.logger.log(`--back--client leaved room ${room} `);
      console.log("--back--he leaved in back room:" + room)
    }
    //
    @SubscribeMessage('chatToServer')
    Message(client: Socket, message: { sender: string,room : string, message: string}) {
        this.wws.emit('chatToClient', message);
    }




    @SubscribeMessage('message')
    MMessage(@MessageBody() message: string): void {
       this.wws.emit('message', message);
    }
  };