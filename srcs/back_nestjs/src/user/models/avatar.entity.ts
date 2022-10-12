import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class AvatarEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {unique: true} )
    filename: string;

    @OneToOne( () => UserEntity, (user) => user.avatar, { /* eager: true, */ onDelete: 'CASCADE' } )
    user: UserEntity;
}