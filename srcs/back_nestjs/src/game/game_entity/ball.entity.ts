import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BallEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column({ nullable: true, type: 'float' })
  x: number;

  @Column({ nullable: true, type: 'float' })
  y: number;

  @Column({ nullable: true, type: 'float' })
  ingame_dx: number;

  @Column({ nullable: true, type: 'float' })
  ingame_dy: number;

  @Column({ nullable: true, type: 'float' })
  init_dx: number;

  @Column({ nullable: true, type: 'float' })
  init_dy: number;

  @Column({ nullable: true, type: 'float' })
  init_first_dx: number;

  @Column({ nullable: true, type: 'float' })
  init_first_dy: number;

  @Column({ nullable: true, type: 'float' })
  first_dx: number;

  @Column({ nullable: true, type: 'float' })
  first_dy: number;

  @Column({ default: false })
  init_ball_pos: boolean = false;

  @Column({ default: false })
  first_col: boolean = false;

  @Column({ default: 'white' })
  color: string = 'white';

  @Column({ default: true })
  right: boolean = true;
}
