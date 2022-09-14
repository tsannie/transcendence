import { UserEntity } from "src/user/models/user.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany } from "typeorm";

@Entity()
export abstract class PrivateMessageEntity {
	@PrimaryGeneratedColumn()
	id: number;
  
	@CreateDateColumn()
	time: string;

	@ManyToMany( () => UserEntity, (user) => user.channels )
	users: UserEntity[];
	
	//MESSAGES ARE HERE:
}