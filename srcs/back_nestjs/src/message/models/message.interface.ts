import { RoomEntity } from 'src/room/models/room.entity';

export interface IMessage {
  id: string;
  room: string;
  author: string;
  content: string;
  time: string;
  //room: RoomEntity
}
