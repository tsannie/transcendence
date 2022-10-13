import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SetEntity } from './set.entity';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true })
  room_name: string;

  @Column('boolean', { default: true })
  is_connected: boolean;

  @Column('boolean', { default: false })
  fast_play: boolean;

  @Column({ nullable: true })
  nbr_co: number = 0;

  @Column('boolean', { default: false })
  gave_up: boolean;

  @Column({ default: 0 })
  spectator: number;
  //boolean

  @Column({ nullable: true })
  p1?: string;

  @Column({ nullable: true })
  p2?: string;

  @Column('boolean', { default: false })
  p1_ready?: boolean;

  @Column('boolean', { default: false })
  p2_ready?: boolean;

  @Column('boolean', { default: false })
  game_started?: boolean;

  @Column('time', { nullable: true })
  thedate?: Date;

  @OneToOne(() => SetEntity, { eager: true, cascade: true })
  @JoinColumn()
  set: SetEntity;

  @Column({ nullable: true , default: -1})
  map: number;

  @Column({ nullable: true , default: -1})
  power: number;
}
