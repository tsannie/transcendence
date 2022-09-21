export interface IMessage {
  id?: string;
  //room: string;
  author?: string;
  content: string;
  time: string;
}

// TODO: add id
export interface IChannel {
  [key: string]: any;
  name: string;
  password?: string;
  status: string;
  owner?: string;
  users?: string[];
  admins?: string[];
  muted?: string[];
  banned?: string[];
}

export interface IDm {
  id?: number;
  targetUsername: string;
}