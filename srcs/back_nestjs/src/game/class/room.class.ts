import { Socket } from 'socket.io';
import { UserEntity } from 'src/user/models/user.entity';
import Ball from './ball.class';

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

export default class Room {
  id: string;

  status: RoomStatus = RoomStatus.EMPTY;
  p1_id: string;
  p2_id: string;

  p1_SocketId: Socket;
  p2_SocketId: Socket;

  p1_score: number = 0;
  p2_score: number = 0;

  won: Winner = Winner.INMATCH;
  game_mode: string;

  p1_y_paddle: number = 0;
  p2_y_paddle: number = 0;

  ball: Ball;

  constructor() {
    this.ball = new Ball();
  }
}
