import { Channel } from 'diagnostics_channel';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
//import * as bcrypt from 'bcrypt';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @Column({ default: false })
  enabled2FA?: boolean

  @Column({ nullable: true })
  secret2FA?: string

  @OneToMany( () => ChannelEntity, (channels) => channels.owner )
  owner_of?: ChannelEntity[];

  @ManyToMany( () => ChannelEntity, (channels) => channels.users )
  @JoinTable()
  channels?: ChannelEntity[];

} 
