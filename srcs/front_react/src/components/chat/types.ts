export interface IMessage {
  id?: string;
  //room: string;
  author?: string;
  content: string;
  time: string;
}

export interface IChannel {
  name: string;
  password?: string;
  status: string;
}