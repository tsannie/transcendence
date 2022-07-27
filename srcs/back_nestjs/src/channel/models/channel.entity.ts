import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
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

  //@ManyToOne() user channel
}
