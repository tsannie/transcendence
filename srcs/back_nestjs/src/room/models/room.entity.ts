import { MessageEntity } from 'src/message/models/message.entity';
import { UserController } from 'src/user/controller/user.controller';
import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  userid: number;

  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  users: UserEntity[];
}
