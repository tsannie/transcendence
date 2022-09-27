import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BallEntity } from './ball.entity';
import { PadleEntity } from './padle.entity';
import { PlayerEntity } from './players.entity';

@Entity()
export class SetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: true })
  room_name: string;

  @OneToOne(() => BallEntity, {eager: true})
  @JoinColumn()
  ball: BallEntity

  @OneToOne(() => PadleEntity, {eager: true})
  @JoinColumn()
  p1_padle_obj: PadleEntity

  @OneToOne(() => PadleEntity, {eager: true})
  @JoinColumn()
  p2_padle_obj: PadleEntity

  @OneToOne(() => PlayerEntity, {eager: true})
  @JoinColumn()
  set_p1: PlayerEntity

  @OneToOne(() => PlayerEntity, {eager: true})
  @JoinColumn()
  set_p2: PlayerEntity

  @Column({ nullable: true })
  score_p1: number;

  @Column({ nullable: true })
  score_p2: number;
}