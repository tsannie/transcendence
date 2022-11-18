import { Exclude, Expose } from 'class-transformer';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { ConnectedUserEntity } from 'src/connected-user/service/models/connected-user.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { GameStatEntity } from 'src/game/entity/gameStat.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @Expose({ groups: ['user', 'me'] })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Expose({ groups: ['user', 'me'] })
  @Column({ unique: true })
  username: string;

  @Expose({ groups: ['me'] })
  @Column({ unique: true })
  email: string;

  @Expose({ groups: ['me'] })
  @CreateDateColumn()
  createdAt: Date;

  @Expose({ groups: ['me'] })
  @UpdateDateColumn()
  updatedAt: Date;

  @Expose({ groups: ['me'] })
  @Column({ default: false })
  enabled2FA: boolean;

  @Exclude()
  @Column({ nullable: true })
  secret2FA: string;

  @Expose({ groups: ['user', 'me'] })
  @ManyToMany(() => UserEntity)
  @JoinTable()
  friends: UserEntity[];

  @Expose({ groups: ['me'] })
  @ManyToMany(() => UserEntity)
  @JoinTable()
  friend_requests: UserEntity[];

  @Expose({ groups: ['me'] })
  @OneToMany(() => ChannelEntity, (channels) => channels.owner, {
    nullable: true,
  })
  owner_of: ChannelEntity[];

  @Expose({ groups: ['me'] })
  @ManyToMany(() => ChannelEntity, (channels) => channels.admins, {
    nullable: true,
  })
  admin_of: ChannelEntity[];

  @Expose({ groups: ['me'] })
  @ManyToMany(() => ChannelEntity, (channels) => channels.users, {
    nullable: true,
  })
  @JoinTable()
  channels: ChannelEntity[];

  @Expose({ groups: ['me'] })
  @ManyToMany(() => DmEntity, (dms) => dms.users, { nullable: true })
  @JoinTable()
  dms: DmEntity[];

  @Expose({ groups: ['me'] })
  @ManyToMany(() => UserEntity)
  @JoinTable()
  blocked: UserEntity[];

  @Expose({ groups: ['me'] })
  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @Expose({ groups: ['user', 'me'] })
  @Column({ nullable: true })
  profile_picture: string;

  @Column({ default: 1000 })
  elo: number;

  @Column({ default: 0 })
  matches: number;

  @Column({ default: 0 })
  wins: number;

  @ManyToMany(() => GameStatEntity, (gameStat) => gameStat.players, {
    nullable: true,
    eager: true,
  })
  @JoinTable()
  history: GameStatEntity[];
}
