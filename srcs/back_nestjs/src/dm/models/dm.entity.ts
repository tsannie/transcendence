import { MessageEntity } from "src/message/models/message.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, Column, OneToMany, ManyToOne, JoinTable, UpdateDateColumn } from "typeorm";

@Entity()
export class DmEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: string;

	@ManyToMany( () => UserEntity, (user) => user.dms, {eager: true})
	users: UserEntity[];

	@OneToMany( () => MessageEntity, (message) => message.dm )
	messages: MessageEntity[];
}