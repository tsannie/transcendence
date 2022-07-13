import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  room: string;

  //@Column()
}
