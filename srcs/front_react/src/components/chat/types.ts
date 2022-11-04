import { User } from "../../contexts/AuthContext";

export interface IMessageSent {
  convId: string; // id du dm ou du channel
  content: string;
  isDm: boolean;
}

export interface IMessageReceived {
  id: string;
  convId: string;
  createdAt: Date;
  content: string;
  author: User | null; // IUser en theorie
  dm: any; // IDm en theorie
  channel: any; // IChannel en theorie
}

export interface ICreateChannel {
  name: string;
  password: string;
  status: string;
}

// TODO: add id
export interface IChannel {
  id: string;
  name: string;
  updatedAt: Date;
  password: string;
  status: string;
  owner: User | null;
  users: User[] | null;
  admins: User[] | null;
  muted: User[] | null;
  banned: User[] | null;
  notif: boolean;
}

export interface IChannelActions {
  channel_name: string;
  target: string;
}

export interface ICreateDm {
  target: string;
}

export interface IDm {
  id: string;
  createdAt: Date;
  updatedAt: string;
  users: User[] | null;
}

export interface IConvCreated {
  id: string;
  time: Date;
  users: User[] | null;
}
