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
export class BallEntity {  
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({ default: 0})
    x: number = 0;

    @Column({ default: 3})  
    y: number = 10;

    @Column({ default: 5}) 
    dx: number = 5;

    @Column({ default: 5})  
    dy: number = 5;

    @Column({ default: 10})  
    rad: number = 10;

    @Column({ default: 3})
    speed: number = 3;

    @Column({ default: "black"})
    color: string = "black";

    @Column({ default: true})
    right: boolean = true;

}

@Entity()
export class PadleEntity {  
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({ default: 20})
    x: number;

    @Column({ default: 3})  
    y: number;

    @Column({ default: 80})  
    width: number;

    @Column({ default: 20})
    height: number;

    @Column({ default: "black"})
    color: string;

}

@Entity()
export class SetEntity {  
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({ nullable: true })
    room_name: string;

    @Column('jsonb', { nullable: true })
    ball: BallEntity;

    @Column('jsonb', { nullable: true })
    player_one_padle_obj?: PadleEntity;

    @Column('jsonb', { nullable: true })
    player_two_padle_obj?: PadleEntity;
}


@Entity()
export class PlayerOneEntity {  
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({ nullable: true })
    player_name: string;

    @Column({ nullable: true })
    player_lives?: string;

    @Column({ nullable: true })
    player_score?: string;

    @Column({ nullable: true })
    player_padle_position?: string;

}

@Entity()
export class PlayerTwoEntity {  
    @PrimaryGeneratedColumn('uuid')
    id!: number;

    @Column({ nullable: true })
    player_name: string;

    @Column({ nullable: true })
    player_lives?: string;

    @Column({ nullable: true })
    player_score?: string;

    @Column({ nullable: true })
    player_padle_position?: string;

}


@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id:number;

  @Column({ nullable: true }) //{ default: makeid(5) }
  room_name : string;

  @Column('boolean', {default: true})
  is_connected : boolean;

  @Column('boolean', {default: false})
  fast_play : boolean;

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

  @Column('boolean', {default: false})
  game_started?: boolean;

  @Column('time', { nullable: true})
  thedate?: Date;

  @Column('time', { nullable: true})
  timer?: Date;

  @Column('jsonb', { nullable: true })
  set: SetEntity;

  @Column('jsonb', { nullable: true })
  set_player_one: SetEntity;

  @Column('jsonb', { nullable: true })
  set_player_two: SetEntity;

  /* @Column('jsonb', { nullable: true })
  rooms_tab: RoomEntity[];} */
}//
