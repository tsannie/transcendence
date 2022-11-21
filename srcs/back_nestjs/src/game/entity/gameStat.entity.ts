import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GameStatEntity {
  // stat d'une game
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  date: Date;

  @ManyToMany(() => UserEntity, (players) => players.history)
  players: UserEntity[];

  @Column( {nullable: true} )
  winner_id?: string;

  @Column( {nullable: true} )
  eloDiff?: number;

  @Column({ nullable: true })
  p1_score?: number;

  @Column({ nullable: true })
  p2_score?: number;
}
