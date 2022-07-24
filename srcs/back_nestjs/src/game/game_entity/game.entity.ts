import { Expose } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

@Entity()
export class RoomEntity {  
    @PrimaryGeneratedColumn('uuid')
    id!: number;

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
  @PrimaryGeneratedColumn()
  id:number;

  @Column({ nullable: true }) //{ default: makeid(5) }
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
