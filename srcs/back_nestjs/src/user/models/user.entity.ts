import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
//import * as bcrypt from 'bcrypt';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;  // TODO remove ? ith new object

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @CreateDateColumn()
  createdAt?: Date;

  @Column()
  @CreateDateColumn()
  updatedAt?: Date;

  @Column({ default: false })
  enabled2FA?: boolean

  @Column({ nullable: true })
  secret2FA?: string

  //@OnetoMany(() => RoomEntity, room => room.users)
  //room: RoomEntity
}
