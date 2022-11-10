import { MessageEntity } from 'src/message/models/message.entity';
import { BanEntity, BanMuteEntity, MuteEntity } from 'src/channel/models/ban.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column({ nullable: false })
  status: string;

  @Column({ select: false, nullable: true }) // remettre le select null si solution trouve
  password: string;

  @ManyToOne(() => UserEntity, (user) => user.owner_of)
  owner: UserEntity;

  @ManyToMany(() => UserEntity, (user) => user.admin_of)
  @JoinTable()
  admins: UserEntity[];

  //CHANGE NEXT TWO FIELDS IF CIRCULAR DEPENDENCIES
  @ManyToMany(() => UserEntity, (user) => user.channels)
  users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.channel)
  messages: MessageEntity[];

  @OneToMany( () => MuteEntity, (mute) => mute.channel )
  muted: MuteEntity[];

  @OneToMany( () => BanEntity, (ban) => ban.channel )
  banned: BanEntity[];
}
