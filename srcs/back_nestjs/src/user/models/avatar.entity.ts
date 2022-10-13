import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class AvatarEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column( {unique: true} )
    filename: string;

    @OneToOne( () => UserEntity, (user) => user.avatar)
    @JoinColumn()
    user: UserEntity;
}