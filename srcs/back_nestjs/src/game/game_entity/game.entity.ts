import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class RoomEntity {  
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    room_name : string;

    @Column({ nullable: true })
    nbr_co : number;

    @Column({ nullable: true })
    player_one?: string;

    @Column({ nullable: true })
    player_two?: string;

}

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  room_name : string;

  @Column({ nullable: true })
  nbr_co : number;

  @Column({ nullable: true })
  player_one?: string;

  @Column({ nullable: true })
  player_two?: string;

  @Column('boolean', {default: false})
  player_one_ready?: boolean;

  @Column('boolean', {default: false})
  player_two_ready?: boolean;


  /* @Column('jsonb', { nullable: true })
  rooms_tab: RoomEntity[];} */
}
