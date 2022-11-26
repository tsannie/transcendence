import { Interface } from 'readline';
import { Socket } from 'socket.io';
import { UserEntity } from 'src/user/models/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { victory_score } from '../const/const';
import Ball from './ball.class';
import Smasher from './smasher.class';
import Wall from './wall.class';

export enum RoomStatus {
  EMPTY = 0,
  WAITING = 1,
  PLAYING = 2,
  CLOSED = 3,
}

export enum Winner {
  INMATCH = 0,
  P1 = 1,
  P2 = 2,
}

export enum GameMode {
  PONG_CLASSIC = 0,
  PONG_TRANS = 1,
}

export interface IQuadrilateral {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface IInfoRoom {
  id: string;
  p1: UserEntity;
  p2: UserEntity;
  p1_score: number;
  p2_score: number;
}

export default class Room {
  id: string;

  status: RoomStatus = RoomStatus.EMPTY;
  p1_id: string;
  p2_id: string;

  p1_SocketId: string;
  p2_SocketId: string;

  p1_score: number = 0;
  p2_score: number = 0;

  won: Winner = Winner.INMATCH;
  game_mode: GameMode;

  p1_y_paddle: number = 0;
  p2_y_paddle: number = 0;

  ball: Ball;
  smasher: IQuadrilateral;
  wall: IQuadrilateral;

  constructor(p1_id: string, mode: GameMode) {
    this.id = uuidv4();
    this.p1_id = p1_id;
    this.ball = new Ball();
    this.game_mode = mode;

    if (mode === GameMode.PONG_TRANS) {
      this.wall = new Wall();
      this.smasher = new Smasher();
    }
  }

  updateScore(player: Winner) {
    this.ball = new Ball();
    if (this.game_mode === GameMode.PONG_TRANS) {
      this.wall = new Wall();
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
