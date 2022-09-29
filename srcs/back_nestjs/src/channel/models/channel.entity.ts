import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChannelEntity {

  @Column()
  name: string;

  @Column()
  status: string;

  @Column({nullable: true} )
  ownerid: string;

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  time: string;
}
