import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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
}