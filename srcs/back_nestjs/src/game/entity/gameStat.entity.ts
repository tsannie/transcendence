import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameStatEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  date: Date;

  @OneToOne(() => UserEntity )
  @JoinColumn()
  p1: UserEntity;

  @OneToOne(() => UserEntity )
  @JoinColumn()
  p2: UserEntity;

  @OneToOne(() => UserEntity )
  @JoinColumn()
  winner: UserEntity;

  @Column()
  p1_score : number;

  @Column()
  p2_score : number;
}
