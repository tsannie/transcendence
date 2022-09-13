import { UserEntity } from "src/user/models/user.entity";

export interface IMessage {
  id: string;
  author?: string;
  content: string;
  createdAt: Date;
  //room: RoomEntity
}
