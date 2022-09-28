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
  owner?: string;
  users?: string[];
  admins?: string[];
  muted?: string[];
  banned?: string[];
}

export interface IChannelActions {
  channel_name: string;
  target: string;
}

export interface IDm {
  id?: number;
  targetUsername: string;
}