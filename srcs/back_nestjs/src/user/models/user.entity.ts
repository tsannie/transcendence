import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	name: string;

	@Column({unique: true})
	email: string;

	@Column()
	password: string;

	@Column()
	@CreateDateColumn()
	createdAt: Date;

	@Column()
	@CreateDateColumn()
	updatedAt: Date;
}
