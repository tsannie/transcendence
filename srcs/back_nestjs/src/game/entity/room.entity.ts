import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoomStatus } from '../const/const';
import { SetEntity } from './set.entity';
import { GameStatEntity } from './gameStat.entity';

@Entity()
export class RoomEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: RoomStatus.EMPTY })
  status: RoomStatus = RoomStatus.EMPTY;

  @OneToOne(() => UserEntity, { eager: true, cascade: true })
  @JoinColumn()
  p1: UserEntity;

  @OneToOne(() => UserEntity, { eager: true, cascade: true })
  @JoinColumn()
  p2: UserEntity;

  @OneToOne(() => SetEntity, { eager: true, cascade: true })
  @JoinColumn()
  set: SetEntity;

  @Column({ nullable: true })
  game_mode: string;

  @Column({ default: 0 })
  spectator: number;
}