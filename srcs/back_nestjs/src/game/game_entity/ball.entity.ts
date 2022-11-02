import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BallEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, type: 'float' })
  x: number;

  @Column({ nullable: true, type: 'float' })
  y: number;

  @Column({ nullable: true, type: 'float' })
  gravity: number;

  // TODO DELL ALL AFTER
  @Column({ default: false })
  init_ball_pos: boolean = false;

  @Column({ default: false })
  first_col: boolean = false;

  @Column({ default: false })
  col_paddle: boolean = false;

  @Column({ default: 'white' })
  color: string = 'white';

  @Column({ default: true })
  right: boolean = true;
  
  ///////////////////

  @Column({ nullable: true})
  direction_x: number;
  
  // up == true / down == false
  @Column({ nullable: true})
  direction_y: number;

  @Column({ nullable: true})
  rad : number = 40;
}