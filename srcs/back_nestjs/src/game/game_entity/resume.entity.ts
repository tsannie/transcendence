import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GameEntity } from './game.entity';

@Entity()
export class ResumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: true })
  name_player_win: string;

  @Column({ nullable: true })
  name_player_lose: string;

  /*   @Column({ default: 0 })
  score_player_win: number = 0;

  @Column({ default: 0 })
  score_player_lose: number = 0;

  @Column('time', { nullable: true })
  thedate: any  = new Date(); */

  /*   @OneToOne(() => GameEntity, (game) => game.resume)
  game: GameEntity; */
}