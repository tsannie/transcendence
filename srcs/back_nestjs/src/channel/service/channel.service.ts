import {
  Body,
  Catch,
  ForbiddenException,
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
		let channel = await this.getChannel(requested_channel.name, ["users"]);
		
		if ((user.channels && user.channels.find( ( elem ) => {elem.name === channel.name} )) 
			|| (user.owner_of && user.owner_of.find( ( elem ) => {elem.name === channel.name})))
			throw new UnprocessableEntityException("User is already member or owner of the channel.")
		if (channel.baned && channel.baned.find( ( elem ) => {elem.username === user.username}))
			throw new ForbiddenException("You've been banned from this channel");

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

	verifyHierarychy(channel : ChannelEntity, requester : UserEntity, targeted_user: string){
		if (channel.owner.username !== requester.username && !channel.admins.find( (admin) => {admin.username === requester.username }))
			throw new ForbiddenException("Only an admin or owner of the channel can ban/unban other members.");
		if (channel.owner.username !== requester.username && channel.admins.find( (admin) => { admin.username === targeted_user }))
			throw new ForbiddenException("An admin cannot ban/unban another admin.");
	}

	async unBanUser(requested_channel: ChannelDto, requester: UserEntity, targeted_user: string) : Promise<ChannelEntity>{
		let channel = await this.getChannel(requested_channel.name, ["owner", "admins", "users", "baned"]);
		this.verifyHierarychy(channel, requester, targeted_user);

		channel.baned = channel.baned.filter( (user) => user.username !== targeted_user);
		return await this.channelRepository.save(channel);
	}

	async banUser(requested_channel: ChannelDto, requester: UserEntity, targeted_user: string) : Promise<ChannelEntity>{
		let channel = await this.getChannel(requested_channel.name, ["owner", "admins", "users", "baned"]);
		this.verifyHierarychy(channel, requester, targeted_user);
		
		const userToBan = await this.userRepository.findOne( {where: {name: targeted_user}});
		if (!channel.baned)
			channel.baned = [userToBan];
		else
			channel.baned.push(userToBan);
		channel.admins = channel.admins.filter( (admin) => admin.username !== targeted_user );
		channel.users = channel.users.filter( (user) => user.username !== targeted_user );
		return await this.channelRepository.save(channel);
	}

	async unMuteUser(){
		
	}

	async muteUser(){

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

  //DELETEMEAFTERTESTING :
  async createFalseUser(username : string) : Promise<UserEntity>{
	const user = new UserEntity();
	user.username = username;
	user.email = username + "@student.42.fr";
	await this.userRepository.save(user);
	return await this.userRepository.findOne({where : {username: username}, 
		relations: ["channels", "owner_of"]});
  }

}
