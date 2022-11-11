import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameStatEntity { // stat d'une game
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

  @Column( {nullable: true} )
  p1_score?: number;

  @Column( {nullable: true} )
  p2_score?: number;
}
