import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomStatus } from '../const/const';
import { SetEntity } from './set.entity';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: RoomStatus.EMPTY })
  status: RoomStatus = RoomStatus.EMPTY;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  p1: UserEntity;

  @OneToOne(() => UserEntity, { eager: true })
  @JoinColumn()
  p2: UserEntity;

  @Column({ default: null })
  p1SocketId: string;

  @Column({ default: null })
  p2SocketId: string;

  @OneToOne(() => SetEntity, { eager: true, cascade: true })
  @JoinColumn()
  set: SetEntity;

  @Column({ nullable: true })
  game_mode: string;
}