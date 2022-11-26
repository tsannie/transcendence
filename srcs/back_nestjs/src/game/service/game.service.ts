import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server, Socket } from 'socket.io';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { GameStatEntity } from '../entity/gameStat.entity';
import Room, {
  IInfoRoom,
  GameMode,
  RoomStatus,
  Winner,
  IGameStat,
  IInfoGame,
} from '../class/room.class';
import Ball from '../class/ball.class';
import wall from '../class/wall.class';
import smasher from '../class/smasher.class';
import { RdbmsSchemaBuilder } from 'typeorm/schema-builder/RdbmsSchemaBuilder';
import Wall from '../class/wall.class';
import Smasher from '../class/smasher.class';

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

  findRoom(user: UserEntity, mode: GameMode): Room {
    let room: Room;

    const size = this.gamesRoom.size;
    if (size !== 0) {
      const all_rooms = this.gamesRoom.values();
      for (const room_db of all_rooms) {
        if (
          room_db.status === RoomStatus.WAITING &&
          room_db.game_mode === mode
        ) {
          room = room_db;
          break;
        }
      }
    }
    if (!room) {
      room = new Room(user.id, mode);

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

  findRoomByUser(user: UserEntity): Room | undefined {
    for (const room of this.gamesRoom.values()) {
      if (room.p1_id === user.id || room.p2_id === user.id) {
        return room;
      }
    }
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

  async createInfoRoom(room: Room): Promise<IInfoRoom> {
    return {
      id: room.id,
      status: room.status,
      p1: await this.userService.findById(room.p1_id),
      p2: await this.userService.findById(room.p2_id),
      p1_score: room.p1_score,
      p2_score: room.p2_score,
    };
  }

  async getCurrentRooms(): Promise<IInfoRoom[]> {
    const current_rooms: IInfoRoom[] = [];
    for (const room of this.gamesRoom.values()) {
      if (room.status === RoomStatus.PLAYING) {
        current_rooms.push(await this.createInfoRoom(room));
      }
    }
    return current_rooms;
  }

  getInfo(allUsers: Map<string, Socket[]>): IInfoGame {
    let player_in_game = 0;
    let player_in_waiting = 0;

    for (const room of this.gamesRoom.values()) {
      if (room.status === RoomStatus.PLAYING) {
        player_in_game += 2;
      } else if (room.status === RoomStatus.WAITING) {
        player_in_waiting += 1;
      }
    }

    const info: IInfoGame = {
      search: player_in_waiting,
      ingame: player_in_game,
      online: allUsers.size,
    };
    return info;
  }

  ////////////////////
  // INGAME FUNCTIONS
  ////////////////////

  async getHistory(user: UserEntity): Promise<IGameStat[]> {
    const history = await this.gameStatRepository.find({
      where: [{ p1_id: user.id }, { p2_id: user.id }],
    });

    // sort history by date
    history.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    // keep only the last 20 games
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    let historyGame: IGameStat[] = [];

    for (const stat of history) {
      const p1 = await this.userService.findById(stat.p1_id);
      const p2 = await this.userService.findById(stat.p2_id);

      historyGame.push({
        p1: p1,
        p2: p2,
        winner: stat.winner_id === p1.id ? Winner.P1 : Winner.P2,
        eloDiff: stat.eloDiff,
        p1_score: stat.p1_score,
        p2_score: stat.p2_score,
      });
    }

    return historyGame;
  }

  getGameStat(p1: UserEntity, p2: UserEntity, room: Room): GameStatEntity {
    let statGame = new GameStatEntity();

    statGame.p1_id = p1.id;
    statGame.p2_id = p2.id;
    statGame.p1_score = room.p1_score;
    statGame.p2_score = room.p2_score;
    if (room.won === Winner.P1) statGame.winner_id = p1.id;
    else statGame.winner_id = p2.id;
    statGame.eloDiff = this.getElo(room, p1, p2);
    return statGame;
  }

  async getStat(room: Room) {
    const p1: UserEntity = await this.userService.findById(room.p1_id);
    const p2: UserEntity = await this.userService.findById(room.p2_id);
    let statGame: GameStatEntity = this.getGameStat(p1, p2, room);

    await this.gameStatRepository.save(statGame);
    await this.userService.add(p1);
    await this.userService.add(p2);
  }

  getElo(room: Room, p1: UserEntity, p2: UserEntity): number {
    let eloDiff: number = 0;
    if (room.won === Winner.P1) {
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
    return Math.round(eloDiff);
  }

  checkGiveUP(socketP1: Socket[], socketP2: Socket[], room: Room): boolean {
    // if no socket is equal to this.usersRoom.get(socketP1) return true

    if (socketP1.every((socket) => this.usersRoom.get(socket) !== room.id)) {
      room.won = Winner.P2;
      room.status = RoomStatus.CLOSED;
      return true;
    } else if (
      socketP2.every((socket) => this.usersRoom.get(socket) !== room.id)
    ) {
      room.won = Winner.P1;
      room.status = RoomStatus.CLOSED;
      return true;
    }
    return false;
  }

  checkNewScore(scoreBeforeUpdate: number[], room: Room): boolean {
    if (
      scoreBeforeUpdate[0] !== room.p1_score ||
      scoreBeforeUpdate[1] !== room.p2_score
    ) {
      return true;
    }
    return false;
  }

  async launchGame(
    room: Room,
    server: Server,
    allUsers: Map<string, Socket[]>,
  ) {
    const socketP1 = allUsers.get(room.p1_id);
    const socketP2 = allUsers.get(room.p2_id);
    let score: number[] = [0, 0];

    server.emit('updateCurrentRoom', await this.createInfoRoom(room));
    while (room.status === RoomStatus.PLAYING) {
      score = [room.p1_score, room.p2_score];
      this.checkGiveUP(socketP1, socketP2, room);
      room.ball.update(room);
      server.in(room.id).emit('updateGame', room);

      if (this.checkNewScore(score, room))
        server.emit('updateCurrentRoom', await this.createInfoRoom(room));

      await new Promise((f) => setTimeout(f, 8));
    }

    if (room.status === RoomStatus.CLOSED) {
      this.getStat(room);
      server.in(room.id).emit('updateGame', room);
      this.gamesRoom.delete(room.id);
    }
  }
}
