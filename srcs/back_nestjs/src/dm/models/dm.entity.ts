import { MessageEntity } from "src/message/models/message.entity";
import { UserEntity } from "src/user/models/user.entity";
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, Column, OneToMany, ManyToOne, JoinTable } from "typeorm";

@Entity()
export class DmEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	time: string;

	@ManyToMany( () => UserEntity, (user) => user.dms )
	users: UserEntity[];

	@OneToMany( () => MessageEntity, (message) => message.dm )
	messages: MessageEntity[];

	// @ManyToMany( 'UserEntity', 'dms' )
	// users?: UserEntity[];

	// @OneToMany( 'MessageEntity', 'dm', { cascade: ["insert", "remove"] } )
	// messages?: MessageEntity[];
}