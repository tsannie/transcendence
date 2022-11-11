import { UserEntity } from "src/user/models/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameStatEntity { // stat d'une game
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  date: Date;

  @ManyToMany(() => UserEntity, (players) => players.history, { eager: true})
  @JoinTable()
  players: UserEntity[];

  // winner = p1 or p2
  @Column()
  winner_id: number; // winner id

  @Column( {nullable: true} )
  p1_score?: number;

  @Column( {nullable: true} )
  p2_score?: number;
}
