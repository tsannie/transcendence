import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlayerEntity } from './players.entity';

@Entity()
export class SetEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => PlayerEntity, { eager: true, cascade: true })
  @JoinColumn()
  p1: PlayerEntity;

  @OneToOne(() => PlayerEntity, { eager: true, cascade: true })
  @JoinColumn()
  p2: PlayerEntity;
}
