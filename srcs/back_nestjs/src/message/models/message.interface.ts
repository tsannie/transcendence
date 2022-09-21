export interface IMessage {
  id: string;
  author?: string;
  content: string;
  createdAt: Date;
  //room: RoomEntity
}