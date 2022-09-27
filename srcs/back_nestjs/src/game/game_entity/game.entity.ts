import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JoinAttribute } from 'typeorm/query-builder/JoinAttribute';
import { ResumeEntity } from './resume.entity';
import { SetEntity } from './set.entity';

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

  @Column('boolean', { default: false })
  gave_up: boolean;

  @Column({ default: 0 })
  spectator: number;

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

  @Column('jsonb', { nullable: true })
  set: SetEntity;

/*   @OneToOne(() => SetEntity, {eager: true, cascade: true})
  @JoinColumn()
  game_set: SetEntity */


  @OneToOne(() => ResumeEntity, {eager: true})
  @JoinColumn()
  resume: ResumeEntity


}