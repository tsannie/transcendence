import { ChannelEntity } from 'src/channel/models/channel.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../user/models/user.entity';

@Entity()
export abstract class BanMuteEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    date: Date;

    @Column( {nullable: true} )
    end: Date;

    @OneToOne( () => UserEntity, {eager: true} )
    @JoinColumn()
    user: UserEntity;
}

@Entity()
export class MuteEntity extends BanMuteEntity {
    @ManyToOne( () => ChannelEntity, (channel) => channel.muted )
    channel: ChannelEntity;
}

@Entity()
export class BanEntity extends BanMuteEntity {
    @ManyToOne( () => ChannelEntity, (channel) => channel.banned )
    channel: ChannelEntity;
}