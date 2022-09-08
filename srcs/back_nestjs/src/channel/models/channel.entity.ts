import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChannelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  time: string;

  @Column( {unique: true} )
  name: string;

  @Column()
  status: string;

  @ManyToOne( () => UserEntity, (user) => user.admin_of )
  owner: UserEntity;

  // @ManyToMany( () => UserEntity, (user) => user.channels )
  // users: UserEntity[];

}
