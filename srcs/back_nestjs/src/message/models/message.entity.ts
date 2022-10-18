import { ChannelEntity } from 'src/channel/models/channel.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MessageEntity {
	@PrimaryGeneratedColumn("uuid")
	uuid: string;

	@CreateDateColumn()
	createdAt?: Date;

	@Column()
	content: string;

	@ManyToOne( () => UserEntity )
	author: UserEntity;

	@ManyToOne( () => DmEntity, (dm) => dm.messages, {onDelete: 'CASCADE'} )
	dm?: DmEntity;

	@ManyToOne( () => ChannelEntity, (channel) => channel.messages, {onDelete: 'CASCADE'} )
	channel?: ChannelEntity;
}
