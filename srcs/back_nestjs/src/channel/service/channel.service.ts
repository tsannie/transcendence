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
import { ChannelPasswordDto } from '../dto/channelpassword.dto';

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
		const channel = await this.getChannel(query_channel.name, ["owner", "users", "admins", "banned", "muted"]);
		
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

	async getUser(username : string, inputed_relations : Array<string> = undefined) : Promise<UserEntity> {
		const user = await this.userService.findByName(username, inputed_relations);

		if (!user)
			throw new UnprocessableEntityException(`Cannot find ${username} in database to process`);
		return user;
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
		if (!inputed_password)
			throw new UnauthorizedException("No password inputed");

		let channel = await this.getChannel(room_name);

		if (await bcrypt.compare(inputed_password, channel.password))
			return true;
		else
			throw new UnauthorizedException("Wrong Password.");
	}

	async hashPassword(inputed_password: string) : Promise<any> {
		return await bcrypt.hash(inputed_password, await bcrypt.genSalt())
	}

	//THIS FUNTION CREATE A NEW CHANNEL USING A DTO THAT FRONT SEND US
	async createChannel(channel: CreateChannelDto, user : UserEntity) : Promise<void | ChannelEntity> {
		let newChannel = new ChannelEntity();

		newChannel.name = channel.name;
		newChannel.status = channel.status;
		newChannel.owner = user;
		newChannel.isMp = false;
		if (channel.status === "Protected" && channel.password) {
			newChannel.password = await this.hashPassword(channel.password);
		}
		return await this.saveChannel(newChannel);
	}

  async leaveChannel(requested_channel: ChannelDto, user: UserEntity) {
		let channel = await this.getChannel(requested_channel.name, ["owner", "admins", "users"]);
		
		if (channel.owner.username === user.username)
		{
			if (channel.admins && channel.admins[0])
			{
				channel.owner = channel.admins[0];
				channel.admins = channel.admins.filter((channel_admins) => { channel_admins.username !== channel.admins[0].username });
				channel.users = channel.users.filter((channel_users) => { channel_users.username !== channel.users[0].username });
			}
			else if (channel.users && channel.users[0])
			{
				channel.owner = channel.users[0];
				channel.users = channel.users.filter((channel_users) => { channel_users.username !== channel.users[0].username });
			}
			else
				return await this.deleteChannel(requested_channel, user);
		}
		if (channel.admins && channel.admins.find( (admins) => admins.username === user.username))
			channel.admins = channel.admins.filter( (channel_admins) => { channel_admins.username !== user.username } )
		if (channel.users && channel.users.find( (users) => users.username === user.username))
			channel.users = channel.users.filter( (channel_users) => { channel_users.username !== user.username } );
		await this.channelRepository.save(channel);
	}

	async deleteChannel(requested_channel: ChannelDto, user: UserEntity) : Promise<ChannelEntity> {
		let channel = await this.getChannel(requested_channel.name, ["owner"]);
		if (channel.owner.username !== user.username)
			throw new ForbiddenException("Only the owner of the channel can delete the channel.");
		else
			return await this.channelRepository.remove(channel);
	}

	async joinChannel(requested_channel: ChannelDto, user: UserEntity) : Promise<ChannelEntity> {
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

	async addPassword(channel_requested: ChannelPasswordDto, user: UserEntity) : Promise<ChannelEntity> {
		let channel = await this.getChannel(channel_requested.name, ["owner"]);

		if (channel.owner.username !== user.username)
			throw new ForbiddenException("Only the owner of the channel can add a password");
		else
		{
			if (channel.status === "Protected")
				await this.checkPassword(channel_requested.current_password, channel_requested.name);
			channel.status = "Protected";
			channel.password = await this.hashPassword(channel_requested.new_password);
		}
		return await this.channelRepository.save(channel);
	}

	async deletePassword(channel_requested: ChannelDto, user: UserEntity) : Promise<ChannelEntity> {
		let channel = await this.getChannel(channel_requested.name, ["owner"]);

		if (channel.owner.username !== user.username)
			throw new ForbiddenException("Only the owner of the channel can delete a password");
		else
		{
			if (channel.status === "Private" || channel.status === "Public")
				throw new UnprocessableEntityException(`Cannot perform that action of this server type: ${channel.status}`)
			if (await this.checkPassword(channel_requested.password, channel_requested.name))
			{	
				channel.status = "Public";
				channel.password = undefined;
			}
		}
		return await this.channelRepository.save(channel);
	}

	verifyHierarychy(channel : ChannelEntity, requester : UserEntity, targeted_user: string){
		if (requester.username === targeted_user)
			throw new ForbiddenException("Cannot apply this action to yourself");
		if (channel.owner.username !== requester.username && !channel.admins.find( (admin) => {admin.username === requester.username }))
			throw new ForbiddenException("Only an admin or owner of the channel can ban/unban other members.");
		if (channel.owner.username !== requester.username && channel.admins.find( (admin) => { admin.username === targeted_user }))
			throw new ForbiddenException("An admin cannot ban/unban another admin.");
	}

	async unBanUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity>{
		let channel = await this.getChannel(request.channel_name, ["owner", "admins", "users", "banned"]);
		this.verifyHierarychy(channel, requester, request.target);

		if (!channel.banned)
			throw new UnprocessableEntityException(`${request.target} is not banned.`);
		else
		{
			const res = channel.banned.find( (user) => user.username !== request.target);
			if (!res)
				throw new UnprocessableEntityException(`${request.target} is not banned.`);
			else
				channel.banned = channel.banned.filter( (banned_user) => banned_user.username !== request.target);
		}
		return await this.channelRepository.save(channel);
	}

	async banUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity>{
		let channel = await this.getChannel(request.channel_name, ["owner", "admins", "users", "banned"]);
		this.verifyHierarychy(channel, requester, request.target);
		
		const userToBan = await this.getUser(request.target);
		if (!channel.banned)
			channel.banned = [userToBan];
		else
		{
			if (channel.banned.find( (banned_guys) => request.target === banned_guys.username))
				throw new UnprocessableEntityException(`${userToBan.username} is already banned`);
			else
				channel.banned.push(userToBan);
		}
		channel.admins = channel.admins.filter( (admin) => admin.username !== request.target );
		channel.users = channel.users.filter( (user) => user.username !== request.target );
		return await this.channelRepository.save(channel);
	}

	async unMuteUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity> {
		let channel = await this.getChannel(request.channel_name, ["owner", "admins", "users", "muted"]);
		this.verifyHierarychy(channel, requester, request.target);

		const userToUnMute = await this.getUser(request.target);
		if (!channel.muted)
			throw new UnprocessableEntityException(`${request.target} is not muted.`);
		else
		{
			const res = channel.muted.find( (user) => user.username === request.target);
			if (!res)
				throw new UnprocessableEntityException(`${request.target} is not muted.`);
			else
				channel.muted = channel.muted.filter( (muted_users) => muted_users.username !== request.target);
		}
		return await this.channelRepository.save(channel);
	}

	async muteUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity> {
		let channel = await this.getChannel(request.channel_name, ["owner", "admins", "users", "muted"]);
		this.verifyHierarychy(channel, requester, request.target);

		const userToMute = await this.getUser(request.target);
		if (!channel.muted)
			channel.muted = [userToMute];
		else
		{
			if (channel.muted.find( (muted_guys) => request.target === muted_guys.username))
				throw new UnprocessableEntityException(`${userToMute.username} is already muted`);
			else
				channel.muted.push(userToMute);
		}
		return await this.channelRepository.save(channel);
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
	return await this.getUser(username, ["channels", "owner_of"]);
  }

  async makeAdmin(req_channel: ChannelActionsDto, user: UserEntity) : Promise<ChannelEntity>{
	let channel = await this.getChannel(req_channel.channel_name, ["owner", "admins"]);
	
	if (channel.owner.username === req_channel.target)
		throw new UnauthorizedException(`Owner ${req_channel.target} is already admin by default of the channel ${channel.name}`)
	if (channel.owner.username !== user.username)
		throw new UnauthorizedException(`Only owner of channel can promote ${req_channel.target} to admin`);
	if (channel.admins && channel.admins.find((admin) => admin.username === req_channel.target))
		throw new UnprocessableEntityException("This member is already an admin of this channel.")
	
	const new_admin = await this.getUser(req_channel.target);
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
