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
import { FindOptionsOrder, FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';
import { CreateChannelDto } from '../dto/createchannel.dto';
import { ChannelEntity } from '../models/channel.entity';
import * as bcrypt from 'bcrypt';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelActionsDto } from '../dto/channelactions.dto';
import { UserService } from 'src/user/service/user.service';
import { ChannelPasswordDto } from '../dto/channelpassword.dto';
import { MessageEntity } from 'src/message/models/message.entity';

@Injectable()
@Catch()
export class ChannelService {
	constructor(
	@InjectRepository(ChannelEntity)
	private channelRepository: Repository<ChannelEntity>,

	private readonly userService: UserService) {}

	/* This function return all the public datas of channel */
	async getPublicData(query_channel: ChannelDto) : Promise<ChannelEntity> {
		const channel = await this.getChannel(query_channel.name, {owner: true, users: true});
		return channel;
	}

	/* This function gets all the data for a normal user. No sensitive information here */
	async getUserData(query_channel: ChannelDto) : Promise<ChannelEntity> {
		const channel = await this.getChannel(query_channel.name, {owner: true, users:true, admins: true, messages: true});
		return channel;
	}

	/* This function returns full data of channel. Sensitive information here. Should be accessed only by admin or owner */
	async getPrivateData(query_channel: ChannelDto) : Promise<ChannelEntity> {
		const channel = await this.getChannel(query_channel.name, {owner: true, users: true, admins: true, banned: true, muted: true, messages: true});
		return channel;
	}

	async getDatas(query_channel: ChannelDto, user: UserEntity) : Promise<
		{
			status: string,
			data: ChannelEntity
		}> {
		console.log("user = ", user);
		if (this.isOwner(query_channel.name, user))
			return {status:"owner", data: await this.getPrivateData(query_channel)};
		else if (this.isAdmin(query_channel.name, user))
			return {status:"admin", data: await this.getPrivateData(query_channel)};
		else if (this.isMember(query_channel.name, user))
			return {status:"user", data: await this.getUserData(query_channel)};
			else
			return {status:"publicUser", data: await this.getPublicData(query_channel)};
		}

		async getChannelsList( user: UserEntity) : Promise<ChannelEntity[]> {
			const relation_options : FindOptionsRelations<ChannelEntity> = {
					messages: {
						author: true,
					}
			}

			const select_options : FindOptionsSelect<ChannelEntity> = {
				id: true,
				name: true,
				messages: {
					createdAt: true,
					content: true,
					author: {
						username: true,
					}
				},
			}

			const order_options : FindOptionsOrder<ChannelEntity> = {
				messages: {
					createdAt: "ASC"
				}
			}

			let reloaded_user = await this.userService.findOptions({
				where: {
					username: user.username,
				},
				relations:{
					owner_of: relation_options,
					admin_of: relation_options,
					channels: relation_options,
				},
				select: {
					owner_of: select_options,
					admin_of: select_options,
					channels: select_options,
				},
				order: {
					owner_of: order_options,
					admin_of: order_options,
					channels: order_options,
				},
			})
		return [...reloaded_user.owner_of, ...reloaded_user.admin_of, ...reloaded_user.channels];
	}

 /*
 	this function is responsible of saving a new Channel and do manage error or
  	redundancy if it happens
 */
	async saveChannel(newChannelEntity : ChannelEntity) : Promise<void | ChannelEntity>{
		return await this.channelRepository.save(newChannelEntity).catch( e => {
			if (e.code === "23505")
				throw new UnprocessableEntityException("Name of Server already exist. Choose another one.");
			else
				console.log(e)
				throw new InternalServerErrorException("Saving of new Channel failed.");
			});
	}

	async getUser(username : string, inputed_relations : FindOptionsRelations<UserEntity> = undefined) : Promise<UserEntity> {
		const user = await this.userService.findByName(username, inputed_relations);

		if (!user)
			throw new UnprocessableEntityException(`Cannot find ${username} in database to process`);
		return user;
	}

	async getChannel(channel_name : string, inputed_relations : FindOptionsRelations<ChannelEntity> = undefined) : Promise<ChannelEntity> {
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
	async checkPassword(inputed_password : string, channel_password: string)
	{
		if (!inputed_password)
			throw new UnauthorizedException("No password inputed");

		if (await bcrypt.compare(inputed_password, channel_password))
			return true;
		else
			throw new UnauthorizedException("Wrong Password.");
	}

	async hashPassword(inputed_password: string) : Promise<any> {
		return await bcrypt.hash(inputed_password, await bcrypt.genSalt())
	}

	async createChannel(channel: CreateChannelDto, user : UserEntity) : Promise<void | ChannelEntity> {
		let newChannel = new ChannelEntity();

		newChannel.name = channel.name;
		newChannel.status = channel.status;
		newChannel.owner = user;
		if (channel.status === "Protected" && channel.password) {
			newChannel.password = await this.hashPassword(channel.password);
		}
		return await this.saveChannel(newChannel);
	}

  async leaveChannel(requested_channel: ChannelDto, user: UserEntity) {
		let channel = await this.getChannel(requested_channel.name, {owner: true, admins: true, users: true});

		if (this.isOwner(requested_channel.name, user))
		{
			if (channel.admins && channel.admins[0])
			{
				channel.owner = channel.admins[0];
				channel.admins = channel.admins.filter(channel_admins => channel_admins.username !== channel.admins[0].username );
			}
			else if (channel.users && channel.users[0])
			{
				channel.owner = channel.users[0];
				channel.users = channel.users.filter(channel_users =>  channel_users.username !== channel.users[0].username );
			}
			else
				return await this.deleteChannel(requested_channel, user);
		}
		if (this.isAdmin(requested_channel.name, user))
			channel.admins = channel.admins.filter( channel_admins => channel_admins.username !== user.username )
		if (this.isMember(requested_channel.name, user))
			channel.users = channel.users.filter( channel_users =>  channel_users.username !== user.username );
		await this.channelRepository.save(channel);
	}

	async deleteChannel(requested_channel: ChannelDto, user: UserEntity) : Promise<ChannelEntity> {
		if (this.isOwner(requested_channel.name, user))
		{
			let to_delete = user.owner_of.find( (channel) => channel.name === requested_channel.name );
			return await this.channelRepository.remove(to_delete);
		}
		else
			throw new ForbiddenException("Only the owner of the channel can delete the channel.");
	}

	async joinChannel(requested_channel: ChannelDto, user: UserEntity) : Promise<ChannelEntity> {
		if (this.isOwner(requested_channel.name, user) || this.isAdmin(requested_channel.name, user) || this.isMember(requested_channel.name, user))
			throw new UnprocessableEntityException("User is already member or owner of the channel.")

		let channel = await this.getChannel(requested_channel.name, {owner: true, users: true, banned: true});
		this.verifyBanned(channel, user.username);

		if (channel.status === 'Protected') {
			return await this.joinProtectedChannels(requested_channel.password, user, channel);
		}
		else
			return await this.joinPublicChannels(user, channel);
	}

	async addPassword(channel_requested: ChannelPasswordDto, user: UserEntity) : Promise<ChannelEntity> {
		if (this.isOwner(channel_requested.name, user))
			throw new ForbiddenException("Only the owner of the channel can add a password");

		let channel = await this.getChannel(channel_requested.name, {owner: true});

		if (channel.status === "Protected")
			await this.checkPassword(channel_requested.current_password, channel.password);
		channel.status = "Protected";
		channel.password = await this.hashPassword(channel_requested.new_password);
		return await this.channelRepository.save(channel);
	}

	async deletePassword(channel_requested: ChannelDto, user: UserEntity) : Promise<ChannelEntity> {
		if (this.isOwner(channel_requested.name, user))
			throw new ForbiddenException("Only the owner of the channel can delete a password");

		let channel = await this.getChannel(channel_requested.name, {owner: true});

		if (channel.status === "Private" || channel.status === "Public")
			throw new UnprocessableEntityException(`Cannot perform that action of this server type: ${channel.status}`)
		if (await this.checkPassword(channel_requested.password, channel.password))
		{
			channel.status = "Public";
			channel.password = undefined;
		}
		return await this.channelRepository.save(channel);
	}

	async unBanUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity>{
		let target = await this.getUser(request.target, {owner_of: true, admin_of: true, channels: true});
		this.verifyHierarchy(request.channel_name, requester, target);

		let channel = await this.getChannel(request.channel_name, {owner: true, admins: true, users: true, banned: true});
		if (!channel.banned)
			throw new UnprocessableEntityException(`${request.target} is not banned.`);
		else
		{
			const res = channel.banned.find( user => user.username === request.target );
			if (!res)
				throw new UnprocessableEntityException(`${request.target} is not banned.`);
			else
				channel.banned = channel.banned.filter( banned_user => banned_user.username !== request.target);
		}
		return await this.channelRepository.save(channel);
	}

	async banUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity>{
		let userToBan = await this.getUser(request.target, {owner_of: true, admin_of: true, channels: true});
		this.verifyHierarchy(request.channel_name, requester, userToBan);
		this.verifyIfMember(request.channel_name, userToBan);

		let channel = await this.getChannel(request.channel_name, {owner: true, admins: true, users: true, banned: true, muted: true});
		if (!channel.banned)
			channel.banned = [userToBan];
		else
		{
			if (channel.banned.find( banned_guys => request.target === banned_guys.username))
				throw new UnprocessableEntityException(`${userToBan.username} is already banned`);
			else
				channel.banned.push(userToBan);
		}
		channel.muted = channel.muted.filter( muted => muted.username !== muted.username );
		channel.admins = channel.admins.filter( admin => admin.username !== request.target );
		channel.users = channel.users.filter( user => user.username !== request.target );
		return await this.channelRepository.save(channel);
	}

	async unMuteUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity> {
		const userToUnMute = await this.getUser(request.target, {owner_of: true, admin_of: true, channels: true});
		this.verifyHierarchy(request.channel_name, requester, userToUnMute);
		this.verifyIfMember(request.channel_name, userToUnMute);

		let channel = await this.getChannel(request.channel_name, {owner: true, admins: true, users: true, muted: true});
		if (!channel.muted)
			throw new UnprocessableEntityException(`${request.target} is not muted.`);
		else
		{
			const res = channel.muted.find( user => user.username === request.target);
			if (!res)
				throw new UnprocessableEntityException(`${request.target} is not muted.`);
			else
				channel.muted = channel.muted.filter( muted_users => muted_users.username !== request.target);
		}
		return await this.channelRepository.save(channel);
	}

	async muteUser(request: ChannelActionsDto, requester: UserEntity) : Promise<ChannelEntity> {
		const userToMute = await this.getUser(request.target, {owner_of: true, admin_of: true, channels: true});
		this.verifyHierarchy(request.channel_name, requester, userToMute);
		this.verifyIfMember(request.channel_name, userToMute);

		let channel = await this.getChannel(request.channel_name, {owner: true, admins: true, users: true, muted: true});
		if (!channel.muted)
			channel.muted = [userToMute];
		else
		{
			if (channel.muted.find( muted_guys => request.target === muted_guys.username))
				throw new UnprocessableEntityException(`${userToMute.username} is already muted`);
			else
				channel.muted.push(userToMute);
		}
		channel.admins = channel.admins.filter( elem => elem.username !== request.target);
		return await this.channelRepository.save(channel);
	}

	async joinPublicChannels(user : UserEntity, channel : ChannelEntity): Promise<ChannelEntity> {
		this.addToUsers(channel, user);
		return await this.channelRepository.save(channel);
	}

	async joinProtectedChannels(password: string, user: UserEntity, channel: ChannelEntity) : Promise<ChannelEntity> {
		if (await this.checkPassword(password, channel.password))
			return await this.joinPublicChannels(user, channel);
	}

	async makeAdmin(req_channel: ChannelActionsDto, user: UserEntity) : Promise<ChannelEntity>{
		const future_admin = await this.getUser(req_channel.target, {owner_of: true, admin_of: true, channels: true});

		if (!this.isOwner(req_channel.channel_name, user))
			throw new UnauthorizedException(`Only owner of channel can promote ${req_channel.target} to admin`);
		if (this.isOwner(req_channel.channel_name, future_admin))
			throw new UnauthorizedException(`Owner ${req_channel.target} is already admin by default of the channel ${req_channel.channel_name}`);
		if (this.isAdmin(req_channel.channel_name, future_admin))
			throw new UnprocessableEntityException("This member is already an admin of this channel.");
		this.verifyIfMember(req_channel.channel_name, future_admin);

		let channel = await this.getChannel(req_channel.channel_name, {admins: true,  muted: true, users: true});
		this.verifyMuted(channel, req_channel.target);

		if (channel.muted && channel.muted.find( muted_guys => muted_guys.username === req_channel.target) )
			throw new UnprocessableEntityException("Cannot make admin a muted member");

		this.addToAdmins(channel, future_admin);
		channel.users = channel.users.filter(user => user.username !== future_admin.username);
		return await this.channelRepository.save(channel);
	}

	async revokeAdmin(req_channel: ChannelActionsDto, user: UserEntity) : Promise<ChannelEntity>{
		if (!this.isOwner(req_channel.channel_name, user))
			throw new UnauthorizedException(`Only owner of channel can revoke administration rights of ${req_channel.target}`);

		let target = await this.getUser(req_channel.target, {admin_of: true, channels: true});

		if (!this.isAdmin(req_channel.channel_name, target))
			throw new UnprocessableEntityException(`${req_channel.target} is not an admin of ${req_channel.channel_name}}`)
		let channel = await this.getChannel(req_channel.channel_name, {admins: true, users: true});
		channel.admins = channel.admins.filter( elem => elem.username !== target.username);
		this.addToUsers(channel, target);
		return await this.channelRepository.save(channel);
	}

	isOwner(searched_channel: string, user: UserEntity) : boolean{
		console.log("owner = ", user.owner_of);
		if (user.owner_of && user.owner_of.find( (channel) => channel.name === searched_channel))
			return true;
		else
			return false;
	}

	isAdmin(searched_channel: string, user: UserEntity) {
		if (user.admin_of && user.admin_of.find( (channel) => channel.name === searched_channel))
			return true;
		else
			return false;
	}

	isMember(searched_channel: string, user: UserEntity) : boolean {
		if (user.channels && user.channels.find( (channel) => channel.name === searched_channel))
			return true;
		else
			return false;
	}


	verifyHierarchy(channel : string, requester : UserEntity, targeted_user: UserEntity){
		if (requester.username === targeted_user.username)
			throw new ForbiddenException("Cannot apply this action to yourself");
		if (!this.isOwner(channel, requester))
		{
			if (!this.isAdmin(channel, requester))
				throw new ForbiddenException("Only an admin or owner of the channel can ban/unban other members.");
			if (this.isOwner(channel, targeted_user) || this.isAdmin(channel, targeted_user))
				throw new ForbiddenException("An admin cannot ban/unban another admin or owner.");
		}
	}

	verifyIfMember(channel: string, target: UserEntity) {
		if (!this.isMember(channel, target) && !this.isAdmin(channel, target))
			throw new UnprocessableEntityException(`${target.username} is not a member of ${channel}`)
	}

	verifyBanned(channel : ChannelEntity, target: string) {
		if (channel.banned && channel.banned.find( banned_guy => banned_guy.username === target))
			throw new ForbiddenException(`${target} is banned from ${channel.name}`);
	}

	verifyMuted(channel : ChannelEntity, target: string) {
		if (channel.muted && channel.muted.find( muted_guy => muted_guy.username === target))
			throw new ForbiddenException(`${target} is muted.`);
	}

	addToUsers(channel: ChannelEntity, user: UserEntity) {
		if (channel.users)
			channel.users.push(user);
		else
			channel.users = [user];
	}

	addToAdmins(channel: ChannelEntity, user: UserEntity) {
		if (channel.admins)
			channel.admins.push(user);
		else
			channel.admins = [user];
	}


	//DELETEMEAFTERTESTING :
	async createFalseUser(username : string) : Promise<UserEntity>{
		const user = new UserEntity();
		user.username = username;
		user.email = username + "@student.42.fr";
		await this.userService.add(user);
		return await this.getUser(username, {channels: true});
	}

	async getAllChannels() : Promise<ChannelEntity[]> {
		return await this.channelRepository.find(
			{
				relations: {
					owner: true,
					users: true
				}
			},
		);
	}
}
