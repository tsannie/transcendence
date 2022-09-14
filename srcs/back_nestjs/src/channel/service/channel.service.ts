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
import { CreateChannelDto } from '../dto/createchannel.dto';
import { ChannelEntity } from '../models/channel.entity';
import * as bcrypt from 'bcrypt';
import { ChannelDto } from '../dto/channel.dto';

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
			relations: ["owner", "users"],
			},
			));
	}


 /*
 	this function is responsible of saving a new Channel and do manage error or
  	redundancy if it happens
 */
	async saveChannel(newChannelEntity : ChannelEntity) : Promise<void | ChannelEntity>{
		return await this.channelRepository.save(newChannelEntity).catch( (e) => {
			if (e.code === "23505")
				throw new UnprocessableEntityException("Name of Server already exist. Choose another one.");
			else
				console.log(e)
				throw new InternalServerErrorException("Saving of new Channel failed.");
			});
	}

	async getChannel(channel_name : string, inputed_relations : Array<string> = undefined) : Promise<ChannelEntity> {
		let returned_channel;

		if (inputed_relations)
		{
			returned_channel = await this.channelRepository.findOne( {
				where: {
					name: channel_name,
				},
				relations: inputed_relations,
			})
		}
		else
		{
			returned_channel = await this.channelRepository.findOne( {
				where: {
					name: channel_name,
				}
			})
		}
		if (!returned_channel)
			throw new UnprocessableEntityException("Couldn't find a server with that name. Try again");
		else
			return returned_channel;
	}

	//THIS FUNCTION COMPARE INPUTED PASSWORD WITH THE ONE STORED IN DATABASE
	async checkPassword(inputed_password : string, room_name : string)
	{
		let channel = await this.channelRepository.findOne( {
			where: {
				name : room_name
			}
		})
		if (await bcrypt.compare(inputed_password, channel.password))
			return true;
		else
			return false;
	}

	//THIS FUNTION CREATE A NEW CHANNEL USING A DTO THAT FRONT SEND US
	async createChannel(channel: CreateChannelDto, user : UserEntity) : Promise<void | ChannelEntity> {
		let newChannel = new ChannelEntity();

		newChannel.name = channel.name;
		newChannel.status = channel.status;
		newChannel.owner = user;
		newChannel.isMp = false;
		if (channel.status === "Protected" && channel.password) {
			newChannel.password = await bcrypt.hash(channel.password, await bcrypt.genSalt());
		}
		return await this.saveChannel(newChannel);
	}

  async leaveChannel(requested_channel: ChannelDto, user: UserEntity) {
		let channel = await this.getChannel(requested_channel.name, ["users"]);
		if (channel.users){
			channel.users = channel.users.filter( (channel_users) => { channel_users.username !== user.username } );
			await this.channelRepository.save(channel);
		}
	}

	async deleteChannel(requested_channel: ChannelDto, user: UserEntity) : Promise<void | ChannelEntity> {
		let channel = await this.getChannel(requested_channel.name, ["owner"]);
		if (channel.owner.username === user.username)
			return await this.channelRepository.remove(channel);
	}

	async joinChannel(requested_channel: ChannelDto, user: UserEntity) {
		console.log("requested_channel = ", requested_channel);
		let channel = await this.getChannel(requested_channel.name);
		if (user.channels && user.channels.find( ( elem ) => elem === channel ))
			throw new UnprocessableEntityException("User is already a member of the channel.")

			if (channel.status === 'Public') {
			return (await this.joinPublicChannels(user, channel));
		}
		else if (channel.status === 'Private') {
			this.joinPrivateChannels();
		}
		else if (channel.status === 'Protected') {
			this.joinProtectedChannels();
		}
		else {
			console.log('error');
		}
	}

	async joinPublicChannels(user : UserEntity, channel : ChannelEntity): Promise<ChannelEntity> {
		console.log('public channels');
		if (channel.users)
			channel.users.push(user);
		else
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
