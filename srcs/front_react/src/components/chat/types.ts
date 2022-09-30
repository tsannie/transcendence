import { IUser } from "../../userlist/UserList";

export interface IMessage {
  id?: string;
  //room: string;
  author?: string;
  content: string;
  time: string;
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
  owner: IUser;
  users: IUser[];
  admins: IUser[];
  muted: IUser[];
  banned: IUser[];
}

export interface IChannelActions {
  channel_name: string;
  target: string;
}

export interface IDm {
  id?: number;
  target: string;
}