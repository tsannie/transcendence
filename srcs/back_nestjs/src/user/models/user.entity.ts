import { Expose } from 'class-transformer';
import { ChannelEntity } from 'src/channel/models/channel.entity';
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
  @PrimaryGeneratedColumn('uuid')
  id: string; // TODO remove :? ith new object

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: false })
  enabled2FA: boolean;

  @Column({ nullable: true })
  secret2FA: string;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  friends: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  friend_requests: UserEntity[];

  @OneToMany(() => ChannelEntity, (channels) => channels.owner, {
    nullable: true,
  })
  owner_of: ChannelEntity[];

  @ManyToMany(() => ChannelEntity, (channels) => channels.admins, {
    nullable: true,
  })
  admin_of: ChannelEntity[];

  @ManyToMany(() => ChannelEntity, (channels) => channels.users, {
    nullable: true,
  })
  @JoinTable()
  channels: ChannelEntity[];

  @ManyToMany(() => DmEntity, (dms) => dms.users, { nullable: true })
  @JoinTable()
  dms: DmEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  blocked: UserEntity[];

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
