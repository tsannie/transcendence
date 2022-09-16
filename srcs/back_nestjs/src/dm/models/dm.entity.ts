import { MessageEntity } from "src/message/models/message.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, Column, OneToMany, ManyToOne } from "typeorm";

@Entity()
export class DmEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	time: string;

	@ManyToMany( () => UserEntity, (user) => user.channels )
	users: UserEntity[];

	@Column( { default: true } )
	isMp: boolean;

	@OneToMany( () => MessageEntity, (message) => message.channel )
	messages: MessageEntity[];
}