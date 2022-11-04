import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BallEntity } from './ball.entity';
import { PaddleEntity } from './paddle.entity';
import { PlayerEntity } from './players.entity';

@Entity()
export class SetEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @OneToOne(() => BallEntity, { eager: true, cascade: true })
  @JoinColumn()
  ball: BallEntity;

  @OneToOne(() => PaddleEntity, { eager: true, cascade: true })
  @JoinColumn()
  p1_paddle: PaddleEntity;

  @OneToOne(() => PaddleEntity, { eager: true, cascade: true })
  @JoinColumn()
  p2_paddle: PaddleEntity;

  @OneToOne(() => PlayerEntity, { eager: true, cascade: true })
  @JoinColumn()
  p1: PlayerEntity;

  @OneToOne(() => PlayerEntity, { eager: true, cascade: true })
  @JoinColumn()
  p2: PlayerEntity;


}
