import { UserEntity } from 'src/user/models/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConnectedUserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  socketId: string;

  @ManyToOne(() => UserEntity, (user) => user.connections)
  user: UserEntity;

}