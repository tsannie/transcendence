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

  @OneToMany( () => ChannelEntity, (channels) => channels.owner )
  owner_of?: ChannelEntity[];

  @ManyToMany( () => DmEntity, (channels) => channels.users )
  @JoinTable()
  channels?: DmEntity[];

  @ManyToMany( () => DmEntity, (dms) => dms.users )
  @JoinTable()
  dms?: DmEntity[];

  @ManyToMany( () => UserEntity)
  @JoinTable()
  banned?: UserEntity[];

  // @OneToMany( () => ChannelEntity, (channels) => channels.users )
  // mp_channels: ChannelEntity[]
}
