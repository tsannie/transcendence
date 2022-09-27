import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelService } from 'src/channel/service/channel.service';
import { DmService } from 'src/dm/service/dm.service';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';
import { IMessage } from '../models/message.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private allMessages: Repository<MessageEntity>,

	private channelService: ChannelService,
	private dmService: DmService,
	private userService: UserService,
  ) {}

	async addMessagetoChannel(data: IMessage) : Promise<MessageEntity> {
		const user = await this.userService.findByName(data.author, ["channels", "owner_of"])
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
		const user = await this.userService.findByName(data.author, ["dms"]);
		const dm = await this.dmService.getDmByName({target: data.target}, user);

		const message = new MessageEntity();
		message.content = data.content;
		message.author = user;
		message.dm = dm;
		return await this.allMessages.save(message);
	}
}
