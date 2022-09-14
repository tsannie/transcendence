import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PrivateMessageEntity } from './private_message.entity';

@Entity()
export class ChannelEntity extends PrivateMessageEntity{
	@Column( {nullable: false, unique: true} )
	name: string;

	@Column({ nullable: false } )
	status: string;

	@ManyToOne( () => UserEntity, (user) => user.owner_of )
	owner: UserEntity;

	@ManyToMany( () => UserEntity )
	@JoinTable()
	admins: UserEntity[];

	@ManyToMany( () => UserEntity )
	@JoinTable()
	muted: UserEntity[];

	@ManyToMany( () => UserEntity )
	@JoinTable()
	ban: UserEntity[];

	@Column( { nullable: true })
	password: string;
}

