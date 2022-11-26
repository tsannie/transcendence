import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import {
  canvas_back_height,
  canvas_back_width,
  gravity,
  paddle_height,
  paddle_p1_x,
  paddle_p2_x,
  paddle_width,
  rad,
  spawn_speed,
  speed,
  victory_score,
} from '../const/const';
import { GameStatEntity } from '../entity/gameStat.entity';
import Room, { RoomStatus, Winner } from '../class/room.class';
import { v4 as uuidv4 } from 'uuid';
import Ball from '../class/ball.class';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameStatEntity)
    private gameStatRepository: Repository<GameStatEntity>,

    private readonly userService: UserService,
  ) {}

  /* RoomID, room */
  private gamesRoom: Map<string, Room> = new Map();

  /* Socket, RoomID */
  private usersRoom: Map<Socket, string> = new Map();

  /*   async findAll(): Promise<RoomEntity[]> {
    return await this.all_game.find();
  } */

  findRoom(user: UserEntity): Room {
    let room: Room;
    let already_in_game: boolean = false;

    const size = this.gamesRoom.size;
    if (size !== 0) {
      const all_rooms = this.gamesRoom.values();
      for (const room_db of all_rooms) {
        if (
          (room_db.p1_id && user.id === room_db.p1_id) ||
          (room_db.p2_id && user.id === room_db.p2_id)
        )
          already_in_game = true;
        else if (room_db.status === RoomStatus.WAITING && !room_db.p2_id)
          room = room_db;
      }
    }
    if (!room && already_in_game === false) {
      room = new Room();
      room.id = uuidv4();
      this.gamesRoom.set(room.id, room);
    }
    return room;
  }

  /*   async deleteUser(): Promise<void> {
    const all_game = await this.all_game.find();
    all_game.forEach(async (game) => {
      await this.all_game.delete({ id: game.id });
    });
  } */

  deleteRoomById(room_id: string) {
    this.gamesRoom.delete(room_id);
  }

  findRoomBySocket(socket: Socket): Room | undefined {
    const room_id = this.usersRoom.get(socket);
    if (room_id) return this.gamesRoom.get(room_id);
    return undefined;
  }

  getRoomById(room_id: string): Room | undefined {
    return this.gamesRoom.get(room_id);
  }

  joinRoom(room_id: string, client: Socket, server: Server) {
    const room_to_leave = this.usersRoom.get(client);
    if (room_to_leave) {
      client.leave(room_to_leave);
    }
    server.in(client.id).socketsJoin(room_id);
    this.usersRoom.set(client, room_id);
  }

  async leaveRoom(room_id: string, client: Socket) {
    if (room_id) {
      client.leave(room_id);
    }
    this.usersRoom.delete(client);
  }

  ////////////////////
  // INGAME FUNCTIONS
  ////////////////////

  /*async losePoint(
    // TODO : update score
    player: PlayerEntity,
    p1: PlayerEntity,
    p2: PlayerEntity,
    room: Room,
    server: Server,
  ) {
    room.ball.x = canvas_back_width / 2;
    room.ball.y = canvas_back_height / 2;
    room.ball.direction_y = 1;
    room.ball.first_col = false;

    player.score += 1;
    if (player.score === victory_score) player.won = true;
    await this.all_player.save(player);
    server.in(room).emit('getScore', p1, p2);
  }*/

  /*getGameStat(p1: UserEntity, p2: UserEntity, room: Room): GameStatEntity {
    // TODO edit setentity
    let statGame = new GameStatEntity();

    statGame.players = [p1, p2];
    statGame.p1_score = room.p1_score;
    statGame.p2_score = room.p2_score;
    if (room.p1.won) statGame.winner_id = p1.id; // TODO
    else statGame.winner_id = p2.id;
    statGame.eloDiff = this.getElo(root, p1, p2);
    return statGame;
  }

  async getStat(room: Room) {
    console.log('CRASH 1');
    console.log(room);
    const p1: UserEntity = await this.userService.findById(room.p1_id);
    console.log('p1 : ', p1);
    console.log('CRASH 2');
    const p2: UserEntity = await this.userService.findById(room.p2_id);
    console.log('p2 : ', p2);
    console.log('CRASH 3');
    let statGame: GameStatEntity = this.getGameStat(p1, p2, room);
    console.log('statGame : ', statGame);
    console.log('CRASH 4');

    await this.updateHistory(p1, p2, statGame);
    console.log('CRASH 5');
    await this.gamesRoomStatRepository.save(statGame);
    console.log('CRASH 6');
  }

  async updateHistory(
    p1: UserEntity,
    p2: UserEntity,
    statGame: GameStatEntity,
  ) {
    if (!p1.history) p1.history = [];
    if (!p2.history) p2.history = [];
    p1.history.push(statGame);
    p2.history.push(statGame);

    await this.userService.add(p1);
    await this.userService.add(p2);
  }

  getElo(room: Room, p1: UserEntity, p2: UserEntity): number {
    let eloDiff: number = 0;
    if (set.p1.won) {
      // TODO
      eloDiff = this.calculateElo(p1.elo, p2.elo, true);

      p1.elo += eloDiff;
      p2.elo -= eloDiff;
      p1.wins++;
    } else {
      eloDiff = this.calculateElo(p1.elo, p2.elo, false);
      p1.elo -= eloDiff;
      p2.elo += eloDiff;
      p2.wins++;
    }
    p1.matches++;
    p2.matches++;
    return eloDiff;
  }

  probaToWinWithElo(eloP1: number, eloP2: number): number {
    return (
      (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (eloP1 - eloP2)) / 400))
    );
  }

  calculateElo(eloP1: number, eloP2: number, isWinnerP1: boolean): number {
    let eloDiff: number = 0;
    const p1 = this.probaToWinWithElo(eloP2, eloP1);
    const p2 = this.probaToWinWithElo(eloP1, eloP2);

    if (isWinnerP1 === true) {
      eloDiff = 30 * (1 - p1);
    } else {
      eloDiff = 30 * (1 - p2);
    }
    // round elodiff to be a number
    console.log('elo diff = ', eloDiff, ' == ', Math.round(eloDiff));
    return Math.round(eloDiff);
  }*/

  async ballHitPaddlep1(room: Room, server: Server) {
    // TODO moove to class ball
    // TODO async ???
    if (
      room.ball.can_touch_paddle === true &&
      room.ball.x - rad <= paddle_p1_x + paddle_width &&
      room.ball.x + rad / 3 >= paddle_p1_x &&
      room.ball.y + rad >= room.p1_y_paddle &&
      room.ball.y - rad <= room.p1_y_paddle + paddle_height
    )
      room.ball.hitPaddle(room.p1_y_paddle);
    else if (room.ball.x - rad <= -(rad * 3)) {
      room.ball.reset();
      room.p2_score += 1;
      if (room.p2_score === victory_score) {
        room.won = Winner.P2;
        room.status = RoomStatus.CLOSED;
      }
      server.in(room.id).emit('getScore', room.p1_score, room.p2_score);
    }
  }

  async ballHitPaddlep2(room: Room, server: Server) {
    // TODO moove to class ball
    if (
      room.ball.can_touch_paddle === true &&
      room.ball.x + rad >= paddle_p2_x &&
      room.ball.x - rad / 3 <= paddle_p2_x + paddle_width &&
      room.ball.y + rad >= room.p2_y_paddle &&
      room.ball.y - rad <= room.p2_y_paddle + paddle_height
    )
      room.ball.hitPaddle(room.p2_y_paddle);
    else if (room.ball.x + rad >= canvas_back_width + rad * 3) {
      room.ball.reset();
      room.p1_score += 1;
      if (room.p1_score === victory_score) {
        room.won = Winner.P1;
        room.status = RoomStatus.CLOSED;
      }
      server.in(room.id).emit('getScore', room.p1_score, room.p2_score);
      //server.in(room).emit('getScore', p1, p2);
    }
  }

  async updateGame(
    room: Room,
    server: Server,
    //
    //room: string,
  ) {
    room.ball.update();
    await this.ballHitPaddlep1(room, server);
    await this.ballHitPaddlep2(room, server);
  }

  checkGiveUP(socketP1: Socket, socketP2: Socket, room: Room): boolean {
    if (this.usersRoom.get(socketP1) !== room.id) {
      room.won = Winner.P2;
      room.status = RoomStatus.CLOSED;
      return true;
    } else if (this.usersRoom.get(socketP2) !== room.id) {
      room.won = Winner.P1;
      room.status = RoomStatus.CLOSED;
      return true;
    }
    return false;
  }

  async launchGame(room: Room, server: Server, allUsers: Map<string, Socket>) {
    // TODO cooldown
    const socketP1 = allUsers.get(room.p1_id);
    const socketP2 = allUsers.get(room.p2_id);

    while (room.status === RoomStatus.PLAYING) {
      this.checkGiveUP(socketP1, socketP2, room);
      this.updateGame(room, server);
      server.in(room.id).emit('updateGame', room);
      await new Promise((f) => setTimeout(f, 8));
    }

    if (room.status === RoomStatus.CLOSED) {
      server.in(room.id).emit('updateGame', room);
      this.gamesRoom.delete(room.id);
    }
  }
}
