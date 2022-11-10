import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserStatEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UserEntity )
  @JoinColumn()
  user: UserEntity;

  @Column()
  matches: number;

  @Column()
  winrate: number;

  @Column()
  elo: number;

  @Column()
  leaderboard: number;
}
