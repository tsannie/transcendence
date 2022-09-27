import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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
 