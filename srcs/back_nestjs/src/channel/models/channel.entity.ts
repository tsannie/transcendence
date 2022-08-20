import { IUser } from 'src/user/models/user.interface';
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

  @Column({nullable: true} )
  ownerid: string;
  //@ManyToOne() user channel
}
