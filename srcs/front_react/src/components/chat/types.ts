import { User } from "../../contexts/AuthContext";

export interface IMessageSent {
  convId: number; // id du dm ou du channel
  author: User | null; // IUser en theorie
  content: string;
  isDm: boolean;
}

export interface IMessageReceived {
  id: string;
  convId: number;
  author: User | null; // IUser en theorie
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
  owner: User | null;
  users: User[] | null;
  admins: User[] | null;
  muted: User[] | null;
  banned: User[] | null;
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
  users: User[] | null;
  messages: IMessageReceived[];
}

export interface IConvCreated {
  id: number;
  time: Date;
  users: User[] | null;
}
