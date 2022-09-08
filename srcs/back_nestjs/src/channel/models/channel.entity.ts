import {
  Column,
  CreateDateColumn,
  Entity,
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

  // @ManyToOne(() => UserEntity, (user) => user.channels )
  // owner: UserEntity[];

  // @ManyToOne(() => UserEntity, (user) => user.channels )
  // users: UserEntity[];

}
