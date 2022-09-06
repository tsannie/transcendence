import { IUser } from "src/user/models/user.interface";

export interface IChannel {
  id: string;
  status: string;
  time: string;
  ownerid: string;
}
