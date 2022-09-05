import { UserEntity } from 'src/user/models/user.entity';

export interface IRoom {
  id: number;
  name: string;
  userid: number;
  users: UserEntity[];
}
