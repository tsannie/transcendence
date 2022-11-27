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

  @Column()
  p1_id: string;

  @Column()
  p2_id: string;

  @Column()
  winner_id: string;

  @Column()
  eloDiff: number;

  @Column()
  p1_score: number;

  @Column()
  p2_score: number;
}
