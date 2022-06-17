import { UserController } from "src/user/controller/user.controller";
import { UserEntity } from "src/user/models/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class RoomEntity {
	@PrimaryGeneratedColumn()
  id: number;

	@Column()
	userid: number;

	@OneToMany(() => UserEntity, user => user.id)
	users: UserEntity[]
}