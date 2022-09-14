import { MessageEntity } from "src/message/models/message.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, Column } from "typeorm";

@Entity()
export abstract class PrivateMessageEntity {
	@PrimaryGeneratedColumn()
	id: number;
  
	@CreateDateColumn()
	time: string;

	@ManyToMany( () => UserEntity, (user) => user.channels )
	users: UserEntity[];
	
	@Column( { default: true } )
	isMp: boolean;

	@ManyToMany( () => MessageEntity, (message) => message.channel )
	messages: MessageEntity[];
}