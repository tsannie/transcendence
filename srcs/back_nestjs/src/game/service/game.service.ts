import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
  IInvitation,
} from '../class/room.class';
import Ball from '../class/ball.class';
import wall from '../class/wall.class';
import smasher from '../class/smasher.class';
import { RdbmsSchemaBuilder } from 'typeorm/schema-builder/RdbmsSchemaBuilder';
import Wall from '../class/wall.class';
import Smasher from '../class/smasher.class';
import { GameGateway } from '../game.gateway';
import { WsException } from '@nestjs/websockets';
import { interval } from 'rxjs';
import { frame_ms } from '../const/const';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameStatEntity)
    private gameStatRepository: Repository<GameStatEntity>,
    private readonly userService: UserService,
    // add gae gateway
    @Inject(forwardRef(() => GameGateway))
    private readonly gameGateway: GameGateway,
  ) {}

  /* RoomID, room */
  private gamesRoom: Map<string, Room> = new Map();

  /* Socket, RoomID */
  private usersRoom: Map<Socket, string> = new Map();

  // try to search a room for the user and return it
  // if no room is found, create a new one
  searchRoom(user: UserEntity, mode: GameMode): Room {
    let room: Room;

    const size = this.gamesRoom.size;
    if (size !== 0) {
      const all_rooms = this.gamesRoom.values();
      for (const room_db of all_rooms) {
        if (
          room_db.status === RoomStatus.WAITING &&
          room_db.game_mode === mode &&
          !room_db.private_room
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

  getInvitations(user_id: string): IInvitation[] {
    const invitations: IInvitation[] = [];
    for (const room of this.gamesRoom.values()) {
      if (
        room.p2_id === user_id &&
        room.status === RoomStatus.WAITING &&
        room.private_room
      ) {
        invitations.push({
          user_id: room.p1_id,
          room_id: room.id,
          mode: room.game_mode,
        });
      }
    }
    return invitations;
  }

  validInvitation(invitation: IInvitation, user_id: string): boolean {
    const invitations = this.getInvitations(user_id);
    for (const inv of invitations) {
      if (
        inv.room_id === invitation.room_id &&
        inv.user_id === invitation.user_id &&
        inv.mode === invitation.mode
      ) {
        return true;
      }
    }
    return false;
  }

  createPrivateRoom(user: UserEntity, p2: string, game_mode: GameMode): Room {
    const room = new Room(user.id, game_mode, true);
    room.p2_id = p2;
    this.gamesRoom.set(room.id, room);
    return room;
  }

  deleteRoomById(room_id: string) {
    this.gamesRoom.delete(room_id);
  }

  async waitingResponse(
    client: Socket,
    room: Room,
    server: Server,
    username_stalk: string,
  ) {
    let log: boolean = true;
    let refuse: boolean = false;

    while (room && room.status === RoomStatus.WAITING) {
      log = this.gameGateway.getAllUsers().has(room.p2_id);
      refuse = this.gamesRoom.has(room.id);

      if (!refuse) {
        this.leaveRoom(room.id, client);
        server.to(client.id).emit('playerRefuse', username_stalk);
        break;
      }

      if (!this.checkUserIsAvailable(room.p2_id) || !log) {
        this.leaveRoom(room.id, client);
        this.deleteRoomById(room.id);
        server.to(client.id).emit('playerNotAvailable', username_stalk);

        if (log) {
          const sockets: Socket[] = this.gameGateway
            .getAllUsers()
            .get(room.p2_id);
          sockets.forEach((socket: Socket) => {
            server.to(socket.id).emit('cancelInvitation', room.id);
          });
        }
        return;
      }

      await new Promise((f) => setTimeout(f, 500));
    }
  }

  getRoomById(room_id: string): Room | undefined {
    return this.gamesRoom.get(room_id);
  }

  getRoomBySocket(socket: Socket): Room | undefined {
    const room_id = this.usersRoom.get(socket);
    if (room_id) return this.getRoomById(room_id);
    return undefined;
  }

  checkUserIsAvailable(user_id: string): boolean {
    for (const room of this.gamesRoom.values()) {
      if (
        ((room.p1_id === user_id || room.p2_id === user_id) &&
          room.status === RoomStatus.PLAYING) ||
        (room.p1_id === user_id && room.status === RoomStatus.WAITING)
      ) {
        return false;
      }
    }
    return true;
  }

  joinRoom(room_id: string, client: Socket, server: Server) {
    if (!this.gamesRoom.has(room_id)) {
      throw new WsException('Room not found');
    }
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

  preventConnexionOfFriends(
    server: Server,
    user: UserEntity,
    allUsers: Map<string, Socket[]>,
    login: boolean = true,
  ) {
    const sockets: Socket[] = this.getSocketsOfFriends(user, allUsers);
    if (login) {
      sockets.forEach((socket) => {
        server.to(socket.id).emit('friendsLogin', user);
      });
    } else {
      sockets.forEach((socket) => {
        server.to(socket.id).emit('friendsLogout', user);
      });
    }
  }

  sendUserDisconnect(
    server: Server,
    user: UserEntity,
    allUsers: Map<string, Socket[]>,
  ) {
    const sockets: Socket[] = this.getSocketsOfFriends(user, allUsers);
    sockets.forEach((socket) => {
      server.to(socket.id).emit('friendsDisconnect', user);
    });
  }

  getSocketsOfFriends(user: UserEntity, allUsers: Map<string, Socket[]>) {
    const friends: UserEntity[] = this.getFriendsLog(user);
    // get all socket of his friends
    const sockets: Socket[] = friends.reduce((acc, friend) => {
      if (allUsers.has(friend.id)) {
        acc.push(...allUsers.get(friend.id));
      }
      return acc;
    }, []);
    return sockets;
  }

  getFriendsLog(user: UserEntity): UserEntity[] {
    const friends: UserEntity[] = user.friends;
    const friendsLog: UserEntity[] = [];

    // recall all users beacause getFriendsLog can be call by service
    const allUsers: Map<string, Socket[]> = this.gameGateway.getAllUsers();

    if (!friends) return friendsLog;

    for (const friend of friends) {
      if (allUsers.has(friend.id)) {
        friendsLog.push(friend);
      }
    }
    return friendsLog;
  }

  getInfo(allUsers: Map<string, Socket[]>): IInfoGame {
    let player_in_game = 0;
    let player_in_waiting = 0;

    for (const room of this.gamesRoom.values()) {
      if (room.status === RoomStatus.PLAYING) {
        player_in_game += 2;
      } else if (room.status === RoomStatus.WAITING && !room.private_room) {
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

  async getHistory(user_id: string): Promise<IGameStat[]> {
    const history = await this.gameStatRepository.find({
      where: [{ p1_id: user_id }, { p2_id: user_id }],
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
    if (!room.private_room) statGame.eloDiff = this.getElo(room, p1, p2);
    else statGame.eloDiff = 0;
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

    while (room.countdown) {
      server.in(room.id).emit('updateGame', room);
      room.countdown--;
      await new Promise((f) => setTimeout(f, 1000));
    }

    while (room.status === RoomStatus.PLAYING) {
      score = [room.p1_score, room.p2_score];
      this.checkGiveUP(socketP1, socketP2, room);
      room.update();
      server.in(room.id).emit('updateGame', room);

      if (this.checkNewScore(score, room))
        server.emit('updateCurrentRoom', await this.createInfoRoom(room));

      await new Promise((f) => setTimeout(f, frame_ms));
    }

    if (room.status === RoomStatus.CLOSED) {
      this.getStat(room);
      server.in(room.id).emit('updateGame', room);
      server.emit('updateCurrentRoom', await this.createInfoRoom(room));
      this.gamesRoom.delete(room.id);
    }
  }
}
