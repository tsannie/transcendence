import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BallEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: true, type: 'float' })
  x: number = 500;

  @Column({ nullable: true, type: 'float' })
  y: number = 250;

  @Column({ nullable: true, type: 'float' })
  gravity: number = 6;

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
  direction_x: number = 1;
  
  // up == true / down == false
  @Column({ nullable: true})
  direction_y: number = 1;

  @Column({ nullable: true})
  spawn: boolean = true;
  /// BALL SPEED MOUV

/*   @Column({ nullable: true, type: 'float' })
  first_dx: number = 2;

  @Column({ nullable: true, type: 'float' })
  first_dy: number = 3;

  @Column({ nullable: true, type: 'float' })
  ingame_dx: number = 4;

  @Column({ nullable: true, type: 'float' })
  ingame_dy: number = 5;

  // POWER UP SPEED MOUV

  @Column({ nullable: true, type: 'float' })
  power_first_dx: number = 3;
  
  @Column({ nullable: true, type: 'float' })
  power_first_dy: number = 4;
  
  @Column({ nullable: true, type: 'float' })
  power_ingame_dx: number = 5;
  
  @Column({ nullable: true, type: 'float' })
  power_ingame_dy: number = 6;

  // BALL SIZE

  @Column({ nullable: true})
  power_rad : number = 30;
 */
  @Column({ nullable: true})
  rad : number = 40;
}