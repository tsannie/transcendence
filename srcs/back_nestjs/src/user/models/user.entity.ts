import { ChannelEntity } from 'src/channel/models/channel.entity';
import { ConnectedUserEntity } from 'src/connected-user/connected-user.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number; // TODO remove :? ith new object

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

  @OneToMany(() => UserEntity, (user) => user.id)
  friends: UserEntity[];

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

  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @Column({ nullable: true })
  profile_picture: string;
}
