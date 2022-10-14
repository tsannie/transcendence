export interface IMessage {
  id: number; // id du dm ou du channel
  uuid: string;
  author: any; // IUser en theorie
  content: string;
  isDm: boolean;
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
  users : any[];
  messages: IMessage[];
}

export interface IConvCreated {
  id: number;
  time: Date;
  //target?: string;
  users : any[];
  //messages: IMessage[];
}

export interface IGetters {
  getAvailableChannels: any[];
  getDms: IDm[];
  getChannelsUsers: any[];
  getUsers: any[];
  getAllUsers: any[];
}