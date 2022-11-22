import { UserEntity } from 'src/user/models/user.entity';
import { RoomStatus } from '../const/const';
import { IBall, PaddlePos } from '../const/interface';

export default class Room {
  id: string;

  status: RoomStatus = RoomStatus.EMPTY;
  p1_id: string;
  p2_id: string;

  p1_SocketId: string;
  p2_SocketId: string;

  p1_score: number = 0;
  p2_score: number = 0;

  won: number = 0;
  game_mode: string;

  p1_y_paddle: number;
  p2_y_paddle: number;

  ball: IBall;
}
