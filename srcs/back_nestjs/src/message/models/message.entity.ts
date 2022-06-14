import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MessageEntity {
  @PrimaryColumn({default: ''})
	id!: string;

	@Column({default: ''})
	room!: string;

	@Column({default: ''})
	author!: string;

	@Column({default: ''})
	content!: string;

	@Column({default: ''})
	time!: string;
}