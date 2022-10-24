export interface IMessageSent {
  id: number; // id du dm ou du channel
  author: any; // IUser en theorie
  content: string;
  isDm: boolean;
}

export interface IMessageReceived {
  uuid: string;
  convId: number;
  author: any; // IUser en theorie
  content: string;
  createdAt: Date;
  dm?: any; // IDm en theorie
  channel?: any; // IChannel en theorie
}

export interface ICreateChannel {
  name: string;
  password: string;
  status: string;
}

// TODO: add id
export interface IChannel {
  id: number;
  name: string;
  password: string;
  status: string;
  owner: any;
  users: any[];
  admins: any[];
  muted: any[];
  banned: any[];
}

export interface IChannelActions {
  channel_name: string;
  target: string;
}

export interface IDm {
  id: number;
  time: Date;
  target: string;
  offset: number;
  users: any[];
  messages: IMessageReceived[];
}

export interface IConvCreated {
  id: number;
  time: Date;
  users: any[];
}
