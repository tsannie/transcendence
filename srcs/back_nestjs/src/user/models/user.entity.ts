import { ChannelEntity } from 'src/channel/models/channel.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
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

  @Column({
    type:"bytea",
    nullable: true,
  })
  avatar?: string;

  @OneToMany( () => ChannelEntity, (channels) => channels.owner, {nullable: true} )
  owner_of?: ChannelEntity[];

  @ManyToMany( () => ChannelEntity, (channels) => channels.admins, {nullable: true} )
  admin_of?: ChannelEntity[];

  @ManyToMany( () => ChannelEntity, (channels) => channels.users, {nullable: true} )
  @JoinTable()
  channels?: ChannelEntity[];

  @ManyToMany( () => DmEntity, (dms) => dms.users, {nullable: true} )
  @JoinTable()
  dms?: DmEntity[];

  @ManyToMany( () => UserEntity)
  @JoinTable()
  banned?: UserEntity[];
}
