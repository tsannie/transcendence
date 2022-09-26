import { MessageEntity } from 'src/message/models/message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChannelEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	time: string;
	
	@Column( {nullable: false, unique: true} )
	name: string;
	
	@Column({ nullable: false } )
	status: string;
	
	@ManyToOne( () => UserEntity, (user) => user.owner_of )
	owner: UserEntity;
	
	@ManyToMany( () => UserEntity )
	@JoinTable()
	admins: UserEntity[];
	
	//CHANGE NEXT TWO FIELDS IF CIRCULAR DEPENDENCIES
	@ManyToMany( () => UserEntity, (user) => user.channels )
	users: UserEntity[];

	@OneToMany( () => MessageEntity, (message) => message.dm )
	messages: MessageEntity[];

	@ManyToMany( () => UserEntity )
	@JoinTable()
	muted: UserEntity[];

	@ManyToMany( () => UserEntity )
	@JoinTable()
	banned: UserEntity[];

	@Column( { nullable: true })
	password: string;
}

