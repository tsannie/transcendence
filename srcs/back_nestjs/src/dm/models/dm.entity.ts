import { MessageEntity } from "src/message/models/message.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, Column, OneToMany, ManyToOne, JoinTable } from "typeorm";

@Entity()
export class DmEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	time: string;

	@ManyToMany( () => UserEntity, (user) => user.dms, {eager: true})
	users: UserEntity[];

	@OneToMany( () => MessageEntity, (message) => message.dm, {onDelete: "CASCADE"} )
	messages: MessageEntity[];
}