import { Channel } from 'diagnostics_channel';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
//import * as bcrypt from 'bcrypt';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @CreateDateColumn()
  updatedAt: Date;

  // @OneToMany( () => ChannelEntity, (channels) => channels.owner )
  // admin_of: ChannelEntity[]

  // @OneToMany( () => ChannelEntity, (channels) => channels.users )
  // channels: ChannelEntity[]

  // @OneToMany( () => ChannelEntity, (channels) => channels.users )
  // mp_channels: ChannelEntity[]
}
