import {
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
  @PrimaryGeneratedColumn('uuid')
  id?: number;

  @OneToOne(() => BallEntity, { eager: true, cascade: true })
  @JoinColumn()
  ball: BallEntity;

  @OneToOne(() => PaddleEntity, { eager: true, cascade: true })
  @JoinColumn()
  p1_paddle_obj: PaddleEntity;

  @OneToOne(() => PaddleEntity, { eager: true, cascade: true })
  @JoinColumn()
  p2_paddle_obj: PaddleEntity;

  @OneToOne(() => PlayerEntity, { eager: true, cascade: true })
  @JoinColumn()
  set_p1: PlayerEntity;

  @OneToOne(() => PlayerEntity, { eager: true, cascade: true })
  @JoinColumn()
  set_p2: PlayerEntity;
}
