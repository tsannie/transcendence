import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
//import * as bcrypt from 'bcrypt';

@Entity()
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @Column({unique: true})
  email: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @CreateDateColumn()
  updatedAt: Date;

  //@ManyToOne(() => RoomEntity, room => room.users)
  //room: RoomEntity
}
