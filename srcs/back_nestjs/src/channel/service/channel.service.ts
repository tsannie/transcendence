import {
  Catch,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { CreateChannelDto } from '../dto/createchannel.dto';
import { ChannelEntity } from '../models/channel.entity';
import * as bcrypt from 'bcrypt';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelActionsDto } from '../dto/channelactions.dto';
import { UserService } from 'src/user/service/user.service';

@Injectable()
@Catch()
export class ChannelService {
	constructor(
	@InjectRepository(ChannelEntity)
	private channelRepository: Repository<ChannelEntity>,

	private readonly userService: UserService,
		
	@InjectRepository(UserEntity)
	private userRepository: Repository<UserEntity>,
	) {}

	async getAllChannels() : Promise<ChannelEntity[]> {
		return await this.channelRepository.find(
			{
			relations: ["owner", "users"],
			},
			);
	}

	async getPrivateData(query_channel: ChannelDto, user: UserEntity) : Promise<ChannelEntity> {
		const channel = await this.getChannel(query_channel.name, ["owner", "users", "admins", "banned"]);
		
		if (channel.owner.username !== user.username && !channel.users.find( (member) => member.username === user.username))
			throw new UnauthorizedException("You cannot access data of a Channel you're not a member of.")
		//ADD HERE VERIFICATION OF CREDENTIALS, VIA USER.CHANNEL or USER.OWNER_OF
		return channel;
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
		if (channel.banned && channel.banned.find( ( elem ) => {elem.username === user.username}))
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

	async unBanUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity>{
		let channel = await this.getChannel(request.channel_name, ["owner", "admins", "users", "banned"]);
		this.verifyHierarychy(channel, requester, request.target);

		channel.banned = channel.banned.filter( (user) => user.username !== request.target);
		return await this.channelRepository.save(channel);
	}

	async banUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity>{
		let channel = await this.getChannel(request.channel_name, ["owner", "admins", "users", "banned"]);
		this.verifyHierarychy(channel, requester, request.target);
		
		const userToBan = await this.userRepository.findOne( {where: {username: request.target}});
		if (!channel.banned)
			channel.banned = [userToBan];
		else
			channel.banned.push(userToBan);
		channel.admins = channel.admins.filter( (admin) => admin.username !== request.target );
		channel.users = channel.users.filter( (user) => user.username !== request.target );
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

  async makeAdmin(req_channel: ChannelActionsDto, user: UserEntity) : Promise<ChannelEntity>{
	let channel = await this.getChannel(req_channel.channel_name, ["owner", "admins"]);
	
	if (channel.owner.username === req_channel.target)
		throw new UnauthorizedException(`Owner ${req_channel.target} is already admin by default of the channel ${channel.name}`)
	if (channel.owner.username !== user.username)
		throw new UnauthorizedException(`Only owner of channel can promote ${req_channel.target} to admin`);
	if (channel.admins && channel.admins.find((admin) => admin.username === req_channel.target))
		throw new UnprocessableEntityException("This member is already an admin of this channel.")
	
	const new_admin = await this.userService.findByName(req_channel.target);
	if (!new_admin)
		throw new UnprocessableEntityException("This user doesn't seem to exist in database.");
	if (channel.admins)
		channel.admins.push(new_admin);
	else
		channel.admins = [new_admin];
	return await this.channelRepository.save(channel);
  }

  async revokeAdmin(req_channel: ChannelActionsDto, user: UserEntity) : Promise<ChannelEntity>{
	let channel = await this.getChannel(req_channel.channel_name, ["owner", "admins"]);
	
	if (channel.owner.username !== user.username)
		throw new UnauthorizedException(`Only owner of channel can revoke administration rights of ${req_channel.target}`);
	if (channel.admins)
	{	
		const filtered = channel.admins.filter( (admin) => admin.username !== req_channel.target);
		if (filtered === channel.admins)
			throw new UnprocessableEntityException("Member is already not an admin");
		else
		{
			channel.admins = filtered;
			return await this.channelRepository.save(channel);
		}
	}
  }

}
