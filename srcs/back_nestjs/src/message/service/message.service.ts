import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { BanMuteService } from 'src/channel/service/banmute.service';
import { MessageDto } from '../dto/message.dto';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { MuteEntity } from 'src/channel/models/ban.entity';
import { MessageGateway } from '../message.gateway';
import { DmService } from 'src/dm/service/dm.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private allMessages: Repository<MessageEntity>,
    private userService: UserService,
    private banMuteService: BanMuteService,
    @Inject(forwardRef(() => MessageGateway))
    private readonly messageGateway: MessageGateway,
    private dmService: DmService,
  ) {}

  /* This fonction checks if user requesting messages in fct loadMessages is allowed to load them */

  checkUserValidity(
    type: string,
    inputed_id: string,
    user: UserEntity,
  ): DmEntity | ChannelEntity | null {
    if (type === 'dm') {
      let dm = user.dms.find((elem) => elem.id === inputed_id);
      if (!dm) return null;
      else return dm;
    } else if (type === 'channel') {
      let owner_of = user.owner_of.find((elem) => elem.id === inputed_id);
      let admin_of = user.admin_of.find((elem) => elem.id === inputed_id);
      let user_of = user.channels.find((elem) => elem.id === inputed_id);
      if (!owner_of && !admin_of && !user_of) return null;
      else return owner_of ? owner_of : admin_of ? admin_of : user_of;
    }
  }

  /* This function generate a query to load messages from dm or channel, depending on request.
	It returns n messages, (where n = LOADED_MESSAGES (higher in this page)) */
  async loadMessages(
    type: string,
    inputed_id: string,
    user: UserEntity,
  ): Promise<MessageEntity[]> {
    if (!this.checkUserValidity(type, inputed_id, user))
      throw new UnauthorizedException(
        `you are not allowed to load ${inputed_id}'s messages`,
      );

    const messages = await this.allMessages
      .createQueryBuilder('message')
      .select('message.id')
      .addSelect('message.createdAt')
      .addSelect('message.content')
      .leftJoin('message.author', 'author')
      .addSelect('author.id')
      .addSelect('author.username')
      .addSelect('author.profile_picture')
      .leftJoin(`message.${type}`, `${type}`)
      .addSelect(`${type}.id`)
      .where(`message.${type}.id = :id`, { id: inputed_id })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    return messages;
  }

  /* Load last message from a dm or a channel */
  async loadLastMessage(
    type: string,
    inputed_id: string,
    user: UserEntity,
  ): Promise<MessageEntity> {
    if (!this.checkUserValidity(type, inputed_id, user))
      throw new UnauthorizedException(
        `you are not allowed to load ${inputed_id}'s messages`,
      );

    return await this.allMessages
      .createQueryBuilder('message')
      .select('message.id')
      .addSelect('message.createdAt')
      .addSelect('message.content')
      .leftJoin('message.author', 'author')
      .addSelect('author.id')
      .addSelect('author.username')
      .addSelect('author.profile_picture')
      .leftJoin(`message.${type}`, `${type}`)
      .addSelect(`${type}.id`)
      .addSelect(`${type}.name`)
      .where(`message.${type}.id = :id`, { id: inputed_id })
      .orderBy('message.createdAt', 'DESC')
      .getOne();
  }

  async addMessagetoChannel(
    data: MessageDto,
    userId: string,
  ): Promise<MessageEntity> {
    const user = await this.userService.findById(userId, {
      dms: true,
      channels: {
        muted: true,
      },
      admin_of: true,
      owner_of: true,
    });
    const channel = this.checkUserValidity(
      'channel',
      data.convId,
      user,
    ) as ChannelEntity;

    if (!channel)
      throw new UnauthorizedException('you are not part of this channel');

    let responseStatus = await this.banMuteService.isMuted(channel, user);
    if (responseStatus === true) {
      throw new WsException("You've Been Muted ! Shhhh. silence.");
    }
    if (responseStatus instanceof MuteEntity) {
      responseStatus.user = user;
      this.messageGateway.unMuteUser(responseStatus, channel.id);
    }

    const message = new MessageEntity();
    message.content = data.content;
    message.author = user;
    message.channel = channel;
    channel.updatedAt = new Date();
    return await this.allMessages.save(message);
  }

  async addMessagetoDm(
    data: MessageDto,
    userId: string,
  ): Promise<MessageEntity> {
    const user = await this.userService.findById(userId, {
      dms: true,
      channels: true,
      admin_of: true,
      owner_of: true,
      blocked: true,
    });
    if (!user)
      throw new UnprocessableEntityException(
        'User does not exist in database.',
      );
    const dm = this.checkUserValidity('dm', data.convId, user) as DmEntity;

    try {
      await this.dmService.checkifBlocked(
        user,
        dm.users.find((elem) => elem.id !== user.id).id,
      );
    } catch (error) {
      throw new WsException(error.message);
    }

    const message = new MessageEntity();

    message.content = data.content;
    message.author = user;
    message.dm = dm;
    dm.updatedAt = new Date();
    return await this.allMessages.save(message);
  }

  // emit message to all users in dm
  emitMessageDm(
    lastMessage: MessageEntity,
    connectedUsers: Map<string, Socket[]>,
  ) {
    for (const user of lastMessage.dm.users) {
      for (const [key, value] of connectedUsers) {
        if (user.id === key) {
          for (const socket of value) {
            socket.emit('message', lastMessage);
          }
        }
      }
    }
  }

  // emit message to all users in channel
  emitMessageChannel(
    channel: ChannelEntity,
    lastMessage: MessageEntity,
    connectedUsers: Map<string, Socket[]>,
  ) {
    let users = [...channel.users, ...channel.admins, channel.owner];

    if (users) {
      for (const user of users) {
        for (const [key, value] of connectedUsers) {
          if (user.id === key) {
            for (const socket of value) {
              socket.emit('message', lastMessage);
            }
          }
        }
      }
    }
  }
}
