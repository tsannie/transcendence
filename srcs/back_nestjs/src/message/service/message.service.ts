import { forwardRef, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channel/service/channel.service';
import { DmService } from 'src/dm/service/dm.service';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';
import { IMessage } from '../models/message.interface';
import { uuid } from 'uuidv4';
import { UserEntity } from 'src/user/models/user.entity';

const LOADED_MESSAGES = 20;

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private allMessages: Repository<MessageEntity>,

	@Inject(forwardRef(() => ChannelService))
	private channelService: ChannelService,
	
	@Inject(forwardRef( () => DmService))
	private dmService: DmService,

	private userService: UserService,
  ) {}

	/* This fonction exists so it checks first if user requesting messages is allowed to load them */
	async checkUserValidity(type: string, inputed_id: number, user: UserEntity) {
		if (type == "dm" && !user.dms.find( elem => elem.id === inputed_id))
			throw new UnprocessableEntityException("User is not part of the dm.");
		/* Is User part of the channel ? let's check it in every field of the entity.
		If Not, we throw a 422 */
		if (type == "channel" && 
			!user.channels.find( elem => elem.id === inputed_id) &&
			!user.owner_of.find( elem => elem.id === inputed_id) && 
			!user.admin_of.find( elem => elem.id === inputed_id))
			throw new UnprocessableEntityException("User is not part of the channel.");
	}

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

	async addMessagetoChannel(data: IMessage) : Promise<MessageEntity> {
		const user = await this.userService.findByName(data.author, {channels: true, owner_of: true})
		let channel = user.channels.find( channel => channel.name === data.channel );
		if (!channel)
			channel = user.owner_of.find( channel => channel.name === data.channel);
		if (!channel)
			throw new UnprocessableEntityException("User is not part of the channel.");

		let message = new MessageEntity();
		message.content = data.content;
		message.author = user;
		message.channel = channel;
		return await this.allMessages.save(message);
	}

	async addMessagetoDm(data: IMessage) : Promise<MessageEntity> {
		const user = await this.userService.findByName(data.author, {dms: true});
		const dm = await this.dmService.getDmByName({target: data.target, offset: 0}, user);

		const message = new MessageEntity();
		message.uuid = uuid();
		message.content = data.content;
		message.author = user;
		message.dm = dm;
		return await this.allMessages.save(message);
	}
}
