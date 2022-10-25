import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { MessageEntity } from '../models/message.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { DmService } from 'src/dm/service/dm.service';
import { Server } from 'socket.io';
import { ChannelService } from 'src/channel/service/channel.service';
import { ConnectedUserEntity } from 'src/connected-user/connected-user.entity';
import { MessageDto } from '../dto/message.dto';

const LOADED_MESSAGES = 20;

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private allMessages: Repository<MessageEntity>,
    private userService: UserService,
    private dmService: DmService,
    private channelService: ChannelService,
  ) {}

  /* This fonction checks if user requesting messages in fct loadMessages is allowed to load them */
  checkUserValidity(
    type: string,
    inputed_id: string,
    user: UserEntity,
  ): DmEntity | ChannelEntity {
    if (type === 'dm') {
      let dm = user.dms.find((elem) => elem.id === inputed_id);
      if (!dm)
        throw new UnprocessableEntityException('User is not part of the dm.');
      else return dm;
    } else if (type === 'channel') {
      let owner_of = user.owner_of.find((elem) => elem.id === inputed_id); // TODO check if == is ok
      let admin_of = user.admin_of.find((elem) => elem.id === inputed_id);
      let user_of = user.channels.find((elem) => elem.id === inputed_id);
      //console.log(owner_of, admin_of, user_of);
      if (!owner_of && !admin_of && !user_of)
        throw new UnprocessableEntityException(
          'User is not part of the channel.',
        );
      else return owner_of ? owner_of : admin_of ? admin_of : user_of;
    }
  }

  /* This function generate a query to load messages from dm or channel, depending on request.
	It returns n messages, (where n = LOADED_MESSAGES (higher in this page)) */
  async loadMessages(
    type: string,
    inputed_id: string,
    offset: number,
    user: UserEntity,
  ): Promise<MessageEntity[]> {
    this.checkUserValidity(type, inputed_id, user);

    const messages = await this.allMessages
      .createQueryBuilder('message')
      .select('message.id')
      .addSelect('message.createdAt')
      .addSelect('message.content')
      .leftJoin('message.author', 'author')
      .addSelect('author.username')
      .leftJoin(`message.${type}`, `${type}`)
      .addSelect(`${type}.id`)
      .where(`message.${type}.id = :id`, { id: inputed_id })
      .orderBy('message.createdAt', 'ASC')
      .skip(offset * LOADED_MESSAGES)
      .take(LOADED_MESSAGES)
      .getMany();

    return messages;
  }

  /* Load last message from a dm or a channel */
  async loadLastMessage(
    type: string,
    inputed_id: string,
    user: UserEntity,
  ): Promise<MessageEntity> {
    this.checkUserValidity(type, inputed_id, user);

    return await this.allMessages
      .createQueryBuilder('message')
      .select('message.id')
      .addSelect('message.createdAt')
      .addSelect('message.content')
      .leftJoin('message.author', 'author')
      .addSelect('author.username')
      .leftJoin(`message.${type}`, `${type}`)
      .addSelect(`${type}.id`)
      .where(`message.${type}.id = :id`, { id: inputed_id })
      .orderBy('message.createdAt', 'DESC')
      .take(1)
      .getOne();
  }

  /* Created two functions to add message to channel or dm, because of the way the database is structured,
	Might necessit refactoring later. TODO*/
  async addMessagetoChannel(data: MessageDto): Promise<MessageEntity> {
    //TODO change input type(DTO over interface) and load less from user
    const user = await this.userService.findByName(data.author.username, {
      dms: true,
      channels: true,
      admin_of: true,
      owner_of: true,
    });
    const channel = this.checkUserValidity(
      'channel',
      data.convId,
      user,
    ) as ChannelEntity;

    const message = new MessageEntity();
    message.content = data.content;
    message.author = user;
    message.channel = channel;
    return await this.allMessages.save(message);
  }

  /* TODO modify input */
  async addMessagetoDm(data: MessageDto): Promise<MessageEntity> {
    console.log('addMessagetoDm = ', data);
    //TODO change input type(DTO over interface) and load less from user
    const user = await this.userService.findByName(data.author.username, {
      dms: true,
      channels: true,
      admin_of: true,
      owner_of: true,
    });
    const dm = this.checkUserValidity('dm', data.convId, user) as DmEntity;

    const message = new MessageEntity();
    message.content = data.content;
    message.author = user;
    message.dm = dm;
    return await this.allMessages.save(message);
  }

  // emit message to all users in dm
  async emitMessageDm(socket: Server, data: MessageDto) {
    const dm = await this.dmService.getDmById(data.convId);

    if (dm) {
      for (const dmUser of dm.users) {
        const user = await this.userService.findByName(dmUser.username, {
          connections: true,
          dms: true,
          channels: true,
          admin_of: true,
          owner_of: true,
        });

        for (const connection of user.connections) {
          const lastMessage = await this.loadLastMessage('dm', dm.id, user);

          if (lastMessage) {
            socket.to(connection.socketId).emit('message', lastMessage);
          }
        }
      }
    }
  }

  // emit message to all users in channel
  async emitMessageChannel(socket: Server, data: MessageDto) {
    const channel = await this.channelService.getChannelById(data.convId);
    console.log(channel);

    if (channel) {
      this.emitMessageToAllUsersInChannel(channel, socket);
    }
  }

  async emitMessageToAllUsersInChannel(channel: ChannelEntity, socket: Server) {
    let users = [...channel.users, ...channel.admins, channel.owner];

    if (users) {
      for (const channelUser of users) {
        const user = await this.userService.findByName(channelUser.username, {
          connections: true,
          dms: true,
          channels: true,
          admin_of: true,
          owner_of: true,
        });

        for (const connection of user.connections) {
          const lastMessage = await this.loadLastMessage(
            'channel',
            channel.id,
            user,
          );

          if (lastMessage) {
            socket.to(connection.socketId).emit('message', lastMessage);
          }
        }
      }
    }
  }
}
