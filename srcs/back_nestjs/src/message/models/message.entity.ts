//import { RoomEntity } from "src/room/models/room.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MessageEntity {
	@PrimaryColumn({unique: true})
  id: string;

	@Column()
	room: string;

	@Column()
	author: string;

	@Column()
	content: string;

	@Column()
	time: string;

	//@ManyToOne(() => RoomEntity, (room) => room.messages)
	//room: RoomEntity
}