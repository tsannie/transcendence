import { DmEntity } from 'src/dm/models/dm.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class ChannelEntity extends DmEntity {
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
	banned: UserEntity[];

	@Column( { nullable: true })
	password: string;
}

