import { ChannelEntity } from 'src/channel/models/channel.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
	@PrimaryGeneratedColumn()
	id: string;

	@CreateDateColumn()
	createdAt?: Date;

	@Column()
	content: string;

	@OneToOne( () => UserEntity )
	@JoinColumn()
	author: UserEntity;

	@ManyToOne( () => DmEntity, (dm) => dm.messages,
		{
			onDelete: "CASCADE",
		})
	dm: DmEntity;
}
