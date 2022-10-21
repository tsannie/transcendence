import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';
import { IMessage } from '../models/message.interface';
import { UserEntity } from 'src/user/models/user.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { BanMuteService } from 'src/channel/service/banmute.service';

const LOADED_MESSAGES = 20;

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private allMessages: Repository<MessageEntity>,
	private readonly banmuteService: BanMuteService,
	private readonly userService: UserService,
  ) {}

	/* This fonction checks if user requesting messages in fct loadMessages is allowed to load them */
	checkUserValidity(type: string, inputed_id: number, user: UserEntity) : DmEntity | ChannelEntity {
		if (type == "dm")
		{
			let dm = user.dms.find( elem => elem.id === inputed_id);
			if (!dm)
			throw new UnprocessableEntityException("User is not part of the dm.");
			else
			return dm;
		}
		if (type == "channel")
		{
			let owner_of = user.owner_of.find( elem => elem.id == inputed_id);
			console.log(inputed_id);
			let admin_of = user.admin_of.find( elem => elem.id == inputed_id);
			let user_of = user.channels.find( elem => elem.id == inputed_id);
			if (!owner_of && !admin_of && !user_of)
				throw new UnprocessableEntityException("User is not part of the channel.");
			else
				return owner_of ? owner_of
					: admin_of ? admin_of
					: user_of;
		}
	}

	/* This function generate a query to load messages from dm or channel, depending on request.
	It returns n messages, (where n = LOADED_MESSAGES (higher in this page)) */
	async loadMessages(type: string, inputed_id: number, offset: number, user: UserEntity) : Promise<MessageEntity[]> {
		this.checkUserValidity(type, inputed_id, user);

		return await this.allMessages
		.createQueryBuilder("message")
		.select("message.uuid")
		.addSelect("message.createdAt")
		.addSelect("message.content")
		.leftJoin("message.author", "author")
		.addSelect("author.username")
		.leftJoin(`message.${type}`, `${type}`)
		.addSelect(`${type}.id`)
		.where(`message.${type}.id = :id`, {id: inputed_id})
		.orderBy("message.createdAt", "DESC")
		.skip(offset * LOADED_MESSAGES)
		.take(LOADED_MESSAGES)
		.getMany();
	}

	/* Created two functions to add message to channel or dm, because of the way the database is structured,
	Might necessit refactoring later. TODO*/
	async addMessagetoChannel(data: IMessage) : Promise<MessageEntity> {
		//TODO change input type(DTO over interface) and load less from user
		const user = await this.userService.findByName(data.author, {dms: true, channels: true, admin_of: true, owner_of: true})
		const channel = this.checkUserValidity("channel", Number(data.id), user) as ChannelEntity;

		if (await this.banmuteService.isMuted(channel, user))
			throw new UnauthorizedException("You're muted. Shush. Silence. No talking.");
		const message = new MessageEntity();
		message.content = data.content;
		message.author = user;
		message.channel = channel;
		return await this.allMessages.save(message);
	}

	/* TODO modify input */
	async addMessagetoDm(data: IMessage) : Promise<MessageEntity> {
		//TODO change input type(DTO over interface) and load less from user
		const user = await this.userService.findByName(data.author, {dms: true, channels: true, admin_of: true, owner_of: true});
		const dm = this.checkUserValidity("dm", Number(data.id), user) as DmEntity;

		const message = new MessageEntity();
		message.content = data.content;
		message.author = user;
		message.dm = dm;
		return await this.allMessages.save(message);
	}
}
