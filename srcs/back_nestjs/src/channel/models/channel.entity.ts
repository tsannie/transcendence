//import { RoomEntity } from "src/room/models/room.entity";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChannelEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column()
  status: string;

  @Column()
  time: string;
}
