import { MessageEntity } from "./message.entity";

export interface IMessage {
  id: string,
  room: string,
  author: string,
  content: string,
  time: string
}