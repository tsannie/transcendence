export interface IMessage {
  uuid?: string;
  //room: string;
  author: string;
  content: string;
  target: string;
}

export interface ICreateChannel {
  name: string;
  password?: string;
  status: string;
}

// TODO: add id
export interface IChannel {
  name: string;
  password?: string;
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
  id?: number;
  time?: Date;
  target?: string;
  users? : any[];
  messages?: IMessage[];
}

export interface IConvCreated {
  id: number;
  time: Date;
  //target?: string;
  users : any[];
  //messages: IMessage[];
}