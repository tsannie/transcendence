export interface IMessage {
  id?: string;
  //room: string;
  author?: string;
  content: string;
  time: string;
}

// TODO: add id
export interface IChannel {
  name: string;
  password?: string;
  status: string;
}

export interface IDm {
  id?: number;
  targetUsername: string;
}