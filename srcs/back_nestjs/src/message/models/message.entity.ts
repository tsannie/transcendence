//import { RoomEntity } from "src/room/models/room.entity";
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  time: string;

  @Column()
  content: string;

  @OneToOne( () => UserEntity )
  @JoinColumn()
  author: UserEntity; 

  // @ManyToOne( () => ChannelEntity, (channel) => channel.messages )
  // channel: ChannelEntity;
}
