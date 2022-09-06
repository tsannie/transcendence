export interface IMessage {
  id: string;
  room: string;
  author: string;
  content: string;
  time: string;
}

export interface IChannel {
  id: string;
  status: string;
  time: string;
}