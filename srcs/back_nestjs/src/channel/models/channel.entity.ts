import { UserEntity } from 'src/user/models/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';
import { PrivateMessageEntity } from './private_message.entity';

@Entity()
export class ChannelEntity extends PrivateMessageEntity{
  @Column( {nullable: false, unique: true} )
  name: string;

  @Column({ nullable: false } )
  status: string;

  @ManyToOne( () => UserEntity, (user) => user.owner_of )
  owner: UserEntity;

  @Column( { nullable: true })
  password: string;

	//NEED A FIELD FOR BANED USERS
}

