import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BallEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, type: 'float' })
  x: number = 500;

  @Column({ nullable: true, type: 'float' })
  y: number = 250;

  @Column({ default: false })
  init_ball_pos: boolean = false;

  @Column({ default: false })
  first_col: boolean = false;

  @Column({ default: 'white' })
  color: string = 'white';

  @Column({ default: true })
  right: boolean = true;

  // BALL SPEED MOUV

  @Column({ nullable: true, type: 'float' })
  ingame_dx: number = 4;

  @Column({ nullable: true, type: 'float' })
  ingame_dy: number = 6;


  @Column({ nullable: true, type: 'float' })
  first_dx: number = 1;

  @Column({ nullable: true, type: 'float' })
  first_dy: number = 2;


  // POWER UP SPEED

  @Column({ nullable: true, type: 'float' })
  power_first_dx: number = 2;
  
  @Column({ nullable: true, type: 'float' })
  power_first_dy: number = 4;


  @Column({ nullable: true, type: 'float' })
  power_ingame_dx: number = 6;

  @Column({ nullable: true, type: 'float' })
  power_ingame_dy: number = 8;
}