import { MessageEntity } from 'src/message/models/message.entity';
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
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChannelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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

  @ManyToMany(() => UserEntity)
  @JoinTable()
  muted: UserEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable()
  banned: UserEntity[];
}
