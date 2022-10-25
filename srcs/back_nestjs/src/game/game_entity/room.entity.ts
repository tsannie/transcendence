import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SetEntity } from './set.entity';

export enum RoomStatus {
  WAITING = 1,
  PLAYING = 2,
  CLOSED = 3,
}
  

@Entity()
export class RoomEntity { // TODO rename RoomEntity
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: RoomStatus.WAITING })
  status: RoomStatus;

  @Column({ nullable: true })
  p1?: string;  // TODO SWITCH IN USER ENTITY 
  
  @Column({ nullable: true })
  p2?: string;  // same
  
  // TODO COUNTDOWN ?? 
  @Column('boolean', { default: false })
  p1_ready?: boolean;
  
  @Column('boolean', { default: false })
  p2_ready?: boolean;
  
  @OneToOne(() => SetEntity, { eager: true, cascade: true })
  @JoinColumn()
  set: SetEntity;

  @Column({ nullable: true , default: -1})
  map: number;
  
/*   @Column({ nullable: true , default: -1})
  power: number; // TODO INSET 
 */



  @Column({ nullable: true })
  room_name: string;//TODO DELL

  @Column('boolean', { default: false })
  fast_play: boolean;// TODO DELL

  @Column({ nullable: true })
  nbr_co: number = 0; // TODO CHANTE TO STATUS -> NBR PLAYERS IN ROOM


  @Column({ default: 0 })
  spectator: number; // TODO DELL IF CAN EMIT WITOUT SPECTATOR
  //boolean

  @Column('boolean', { default: false })
  game_started?: boolean; // WHI STATUS -> 


/*   @OneToOne( () => StatEntity )
  @JoinColumn()
  stat: StatEntity; */
}

/* //USER
@ManyToMany( () => StatEntity )
@JoinTable()
stat : StatEntity[]

@Entity()
export class StatEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column('time', { nullable: true })
  date?: Date;

  @OneToOne(() => UserEntity )
  @JoinColumn()
  player1: UserEntity;

  @OneToOne(() => UserEntity )
  @JoinColumn()
  player2: UserEntity;

  @OneToOne(() => UserEntity )
  @JoinColumn()
  winner: UserEntity;

  @Column()
  player1_score : number;

  @Column()
  player2_score : number;
} */
