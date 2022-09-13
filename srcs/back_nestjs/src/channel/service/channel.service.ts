import {
  Body,
  Catch,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserEntity } from 'src/user/models/user.entity';
import { MetadataAlreadyExistsError, Repository } from 'typeorm';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelEntity } from '../models/channel.entity';
import * as bcrypt from 'bcrypt';
import { CreateChannelDto } from '../dto/createchannel.dto';

@Injectable()
@Catch()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  getAllChannels() : Observable<ChannelEntity[]> {
    return from(this.channelRepository.find(
      {
        relations: ["owner"],
      },
      ));
  }

 /*
 	this function is responsible of saving a new Channel and do manage error or 
  	redundancy if it happens
 */ 
  async saveChannel(newChannelEntity : ChannelEntity) : Promise<void | ChannelEntity>
  {
	return await this.channelRepository.save(newChannelEntity).catch( (e) => {
		if (e.code === "23505")
			throw new UnprocessableEntityException("Name of Server aleready exist. Choose another one.");
		else
			console.log(e)
			throw new InternalServerErrorException("Saving of new Channel failed.");
		});
  }

//THIS FUNCTION COMPARE INPUTED PASSWORD WITH THE ONE STORED IN DATABASE
  async checkPassword(password : string, room_name : string)
  {
	let channel = await this.channelRepository.findOne( {
		where: {
			name : room_name
		}
	})
	if (await bcrypt.compare(password, channel.password))
		return true;
	else
		return false;
  }

  //THIS FUNTION CREATE A NEW CHANNEL USING A DTO THAT FRONT SEND US
  async createChannel(channel: ChannelDto, user : UserEntity) : Promise<void | ChannelEntity> {
    let newChannel = new ChannelEntity();

    newChannel.name = channel.name;
    newChannel.status = channel.status;
    newChannel.owner = user;
    if (channel.status === "Protected" && channel.password) {
      newChannel.password = await bcrypt.hash(channel.password, await bcrypt.genSalt());
    }

    return await this.saveChannel(newChannel);
  }

  async joinChannel(requested_channel: CreateChannelDto, user: UserEntity) {
    let channel_info = await this.channelRepository.findOne({
      where: {
        name : requested_channel.name,
      },
      //relations: ["messages"],
    });
    if (!channel_info)
    {
      console.log("channel doesn't exist");
      return ;
    }
    if (channel_info.status === 'Public') {
      return (await this.joinPublicChannels(user, channel_info));
    } else if (channel_info.status === 'Private') {
      this.joinPrivateChannels();
    } else if (channel_info.status === 'Protected') {
      this.joinProtectedChannels();
    } else {
      console.log('error');
    }
  }

  async joinPublicChannels(user : UserEntity, channel : ChannelEntity): Promise<ChannelEntity> {
    console.log('public channels');
    channel.users = [user];
    return await this.channelRepository.save(channel);
  }

  joinPrivateChannels(): void {
    console.log('private channels');
  }
  joinProtectedChannels(): void {
    console.log('protected channels');
  }
}
