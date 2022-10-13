import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { uuid } from 'uuidv4';
import { MessageEntity } from '../models/message.entity';
import { IMessage } from '../models/message.interface';
import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from 'src/user/models/user.entity';
import { DmEntity } from 'src/dm/models/dm.entity';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { DmService } from 'src/dm/service/dm.service';
import { Server } from 'socket.io';
import { ChannelService } from 'src/channel/service/channel.service';
import { ConnectedUserEntity } from 'src/connected-user/connected-user.entity';

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
    inputed_id: number,
    user: UserEntity,
  ): DmEntity | ChannelEntity {
    if (type === 'dm') {
      let dm = user.dms.find((elem) => elem.id == inputed_id);
      if (!dm)
        throw new UnprocessableEntityException('User is not part of the dm.');
      else return dm;
    } else if (type === 'channel') {
      let owner_of = user.owner_of.find((elem) => elem.id == inputed_id); // TODO check if == is ok
      let admin_of = user.admin_of.find((elem) => elem.id == inputed_id);
      let user_of = user.channels.find((elem) => elem.id == inputed_id);
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
    inputed_id: number,
    offset: number,
    user: UserEntity,
  ): Promise<MessageEntity[]> {
    this.checkUserValidity(type, inputed_id, user);

    return await this.allMessages
      .createQueryBuilder('message')
      .select('message.uuid')
      .addSelect('message.createdAt')
      .addSelect('message.content')
      .leftJoin('message.author', 'author')
      .addSelect('author.username')
      .leftJoin(`message.${type}`, `${type}`)
      .addSelect(`${type}.id`)
      .where(`message.${type}.id = :id`, { id: inputed_id })
      .orderBy('message.createdAt', 'DESC')
      .skip(offset * LOADED_MESSAGES)
      .take(LOADED_MESSAGES)
      .getMany();
  }

  /* Created two functions to add message to channel or dm, because of the way the database is structured,
	Might necessit refactoring later. TODO*/
  async addMessagetoChannel(data: IMessage): Promise<MessageEntity> {
    //TODO change input type(DTO over interface) and load less from user
    const user = await this.userService.findByName(data.author, {
      dms: true,
      channels: true,
      admin_of: true,
      owner_of: true,
    });
    const channel = this.checkUserValidity(
      'channel',
      Number(data.id),
      user,
    ) as ChannelEntity;

    const message = new MessageEntity();
    message.content = data.content;
    message.author = user;
    message.channel = channel;
    return await this.allMessages.save(message);
  }

  /* TODO modify input */
  async addMessagetoDm(data: IMessage): Promise<MessageEntity> {
    //TODO change input type(DTO over interface) and load less from user
    const user = await this.userService.findByName(data.author, {
      dms: true,
      channels: true,
      admin_of: true,
      owner_of: true,
    });
    const dm = this.checkUserValidity('dm', Number(data.id), user) as DmEntity;

    const message = new MessageEntity();
    message.content = data.content;
    message.author = user;
    message.dm = dm;
    return await this.allMessages.save(message);
  }

  // emit message to all users in dm
  async emitMessageDm(socket: Server, data: IMessage) {
    const dm = await this.dmService.getDmById(data.id);

    if (dm) {
      console.log('dm.users', dm.users);
      for (const dmUser of dm.users) {
        const user = await this.userService.findByName(dmUser.username, { connections: true })

        for (const connection of user.connections) {
          if (data.author !== dmUser.username) {
            socket.to(connection.socketId).emit('message', data);
          }
        }
      }
    }
  }

  // emit message to all users in channel
  async emitMessageChannel(socket: Server, data: IMessage) {
		const channel = await this.channelService.getChannelById(data.id);

    console.log(channel);
    if (channel) {
      console.log('channel.users', channel.users);
      channel.users.forEach((user: UserEntity) => {
        // load relations to get connected users
        this.userService
          .findByName(user.username, { connections: true })
          .then((user: UserEntity) => {
            user.connections.forEach((connection) => {
              socket.to(connection.socketId).emit('message', data);
            });
          });
      });

			this.userService
          .findByName(channel.owner.username, { connections: true })
          .then((user: UserEntity) => {
            user.connections.forEach((connection) => {
              socket.to(connection.socketId).emit('message', data);
            });
          });
    }
	}
}
