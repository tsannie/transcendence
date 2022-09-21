import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()

//  Entity of the Ball in game

export class BallEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ default: 0 })
  x: number = 0;

  @Column({ default: 3 })
  y: number = 10;

  @Column({ default: 5 })
  ingame_dx: number;

  @Column({ default: 5 })
  ingame_dy: number;

  @Column({ default: 5 })
  init_dx: number;

  @Column({ default: 5 })
  init_dy: number;

  @Column({ default: 5 })
  init_first_dx: number;

  @Column({ default: 5 })
  init_first_dy: number;

  @Column({ default: 5 })
  first_dx: number;

  @Column({ default: 5 })
  first_dy: number;

  @Column({ default: false })
  init_ball_pos: boolean = false;

  @Column({ default: false })
  first_col: boolean = false;

  @Column({ default: 10 })
  rad: number = 10;

  @Column({ default: 3 })
  speed: number = 3;

  @Column({ default: 'white' })
  color: string = 'white';

  @Column({ default: true })
  right: boolean = true;
}

// Entity of the Paddle in game

@Entity()
export class PaddleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ default: 20 })
  x: number;

  @Column({ default: 3 })
  y: number;

  @Column({ default: 80 })
  width: number;

  @Column({ default: 20 })
  height: number;

  @Column({ default: 'white' })
  color: string = 'white';
}

// Entity of the Players


@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  score: number;

  @Column('boolean', { default: false })
  won: boolean;
}

// Entity of the Actual Set

@Entity()
export class SetEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: true })
  room_name: string;

  @Column('jsonb', { nullable: true })
  ball: BallEntity;

  @Column('jsonb', { nullable: true })
  p1_padle_obj?: PaddleEntity;

  @Column('jsonb', { nullable: true })
  p2_padle_obj?: PaddleEntity;

  @Column('jsonb', { nullable: true })
  set_p1: PlayerEntity;

  @Column('jsonb', { nullable: true })
  set_p2: PlayerEntity;

  @Column({ nullable: true })
  score_p1: number;

  @Column({ nullable: true })
  score_p2: number;
}

// Entity of the whole Game Room status

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  room_name: string;

  @Column('boolean', { default: true })
  is_connected: boolean;

  @Column('boolean', { default: false })
  fast_play: boolean;

  @Column({ nullable: true })
  nbr_co: number;

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

  @Column('time', { nullable: true })
  timer?: Date;

  @Column('jsonb', { nullable: true })
  set: SetEntity;
}
