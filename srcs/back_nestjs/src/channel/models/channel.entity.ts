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

  @Column( {nullable: false, unique: true} )
  name: string;

  @Column({ nullable: false } )
  status: string;

  @ManyToOne( () => UserEntity, (user) => user.admin_of )
  owner: UserEntity;

  @Column( { nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  // @ManyToMany( () => UserEntity, (user) => user.channels )
  // users: UserEntity[];

}
