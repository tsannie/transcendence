//import { RoomEntity } from "src/room/models/room.entity";
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { PrivateMessageEntity } from 'src/channel/models/private_message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
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

	@ManyToMany( () => PrivateMessageEntity, (channel) => channel.messages, 
		{
			onDelete: "CASCADE",
		})
	@JoinColumn()
	channel: ChannelEntity;
}
