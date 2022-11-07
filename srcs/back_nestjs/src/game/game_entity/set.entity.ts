import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BallEntity } from './ball.entity';
import { PlayerEntity } from './players.entity';

@Entity()
export class SetEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => BallEntity, { eager: true, cascade: true })
  @JoinColumn()
  ball: BallEntity;

  @OneToOne(() => PlayerEntity, { eager: true, cascade: true })
  @JoinColumn()
  p1: PlayerEntity;

  @OneToOne(() => PlayerEntity, { eager: true, cascade: true })
  @JoinColumn()
  p2: PlayerEntity;

}
