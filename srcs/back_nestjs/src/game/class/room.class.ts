import { UserEntity } from 'src/user/models/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { frame_ms, victory_score } from '../const/const';
import Ball from './ball.class';
import Smasher from './smasher.class';
import Wall from './wall.class';

export enum RoomStatus {
  WAITING = 0,
  PLAYING = 1,
  CLOSED = 2,
}

export enum Winner {
  INMATCH = 0,
  P1 = 1,
  P2 = 2,
}

export enum GameMode {
  CLASSIC = 0,
  TRANS = 1,
}

export interface IQuadrilateral {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface IGameStat {
  p1: UserEntity;
  p2: UserEntity;
  winner: Winner;
  eloDiff: number;
  p1_score: number;
  p2_score: number;
}

export interface IInfoRoom {
  id: string;
  status: RoomStatus;
  p1: UserEntity;
  p2: UserEntity;
  p1_score: number;
  p2_score: number;
}

export interface IInfoGame {
  search: number;
  ingame: number;
  online: number;
}

export interface IInvitation {
  user_id: string;
  room_id: string;
  mode: GameMode;
}

export default class Room {
  id: string;
  private_room: boolean;

  status: RoomStatus = RoomStatus.WAITING;
  p1_id: string;
  p2_id: string;

  p1_score: number = 0;
  p2_score: number = 0;

  won: Winner = Winner.INMATCH;
  game_mode: GameMode;

  p1_y_paddle: number = 0;
  p2_y_paddle: number = 0;

  ball: Ball;
  smasher: Smasher;
  wall: Wall;
  countdown: number = 5000;

  constructor(p1_id: string, mode: GameMode, private_room: boolean = false) {
    this.id = uuidv4();
    this.p1_id = p1_id;
    this.ball = new Ball();
    this.game_mode = mode;
    this.private_room = private_room;

    if (mode === GameMode.TRANS) {
      this.wall = new Wall();
      this.smasher = new Smasher();
    }
  }

  gameLoop() {
    if (this.countdown >= 1000) {
      this.countdown -= frame_ms;
    } else this.ball.update(this);
  }

  updateScore(player: Winner) {
    this.ball.reset();
    if (this.game_mode === GameMode.TRANS) {
      this.wall = null;
      this.wall = new Wall();
      this.smasher = null;
      this.smasher = new Smasher();
    }
    if (player === Winner.P2) {
      this.p2_score += 1;
      if (this.p2_score === victory_score) {
        this.won = Winner.P2;
        this.status = RoomStatus.CLOSED;
      }
    } else if (player === Winner.P1) {
      this.p1_score += 1;
      if (this.p1_score === victory_score) {
        this.won = Winner.P1;
        this.status = RoomStatus.CLOSED;
      }
    }
  }
}
