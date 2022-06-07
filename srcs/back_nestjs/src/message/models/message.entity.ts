import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MessageEntity {
  @PrimaryColumn()
	id: string;

	@Column()
	content: string;
}