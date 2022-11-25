import {
  Catch,
  ConsoleLogger,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CreateChannelDto } from '../dto/createchannel.dto';
import { ChannelEntity } from '../models/channel.entity';
import * as bcrypt from 'bcrypt';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelActionsDto } from '../dto/channelactions.dto';
import { UserService } from 'src/user/service/user.service';
import { ChannelPasswordDto } from '../dto/channelpassword.dto';
import { IChannelReturn } from '../models/channel_return.interface';
import { BanEntity, BanMuteEntity, MuteEntity } from '../models/ban.entity';
import { BanMuteService } from './banmute.service';

export interface IAdmin {
  target: UserEntity,
  channel: ChannelEntity,
}

@Injectable()
@Catch()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private channelRepository: Repository<ChannelEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly banmuteService: BanMuteService,
  ) {}

  /* This function return all the public datas of channel */
  async getPublicData(query_channel: ChannelDto): Promise<ChannelEntity> {
    const channel = await this.getChannel(query_channel.id, {
      owner: true,
      users: true,
    });
    return channel;
  }

  /* This function returns full data of channel. Sensitive information here. Should be accessed only by admin or owner */
  async getPrivateData(query_channel: ChannelDto): Promise<ChannelEntity> {
    const channel = await this.getChannel(query_channel.id, {
      owner: true,
      users: true,
      admins: true,
      banned: true,
      muted: true,
    });
    return channel;
  }

  /* This function returns the data form a selected channel, based on hierarchy in the channel. Message
	needs to be loaded separately */
  async getDatas(
    query_channel: ChannelDto,
    user: UserEntity,
  ): Promise<IChannelReturn> {
    let isOwner: boolean = this.isOwner(query_channel.id, user);
    let isAdmin: boolean = this.isAdmin(query_channel.id, user);
    let isUser: boolean = this.isMember(query_channel.id, user);

    let response: IChannelReturn = { status: '', data: null };
    if (!isOwner && !isAdmin && !isUser) {
      return {
        status: 'public',
        data: await this.getPublicData(query_channel),
      };
    } else {
      if (isUser) {
        response.status = 'user';
      } else {
        if (isOwner) response.status = 'owner';
        if (isAdmin) response.status = 'admin';
      }
      response.data = await this.getPrivateData(query_channel);
    }
    return response;
  }

  /* This getter returns the list of available channels (public and protected) that a user can join */
  async getList(user: UserEntity): Promise<ChannelEntity[]> {
    const res = await this.channelRepository.find({
      where: [{ status: 'Public' }, { status: 'Protected' }],
      order: {
        createdAt: 'ASC',
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
      relations: {
        owner: true,
      },
    });

    const channelsUser = await this.getUserList(user);
    const channelsId = channelsUser.map((channel) => channel.id);
    return res.filter((channel) => !channelsId.includes(channel.id));
  }

  /* This getter returns list of channels the user is part of, as an Owner, an admin, or a simple user */
  async getUserList(user: UserEntity): Promise<ChannelEntity[]> {
    return [...user.owner_of, ...user.admin_of, ...user.channels].sort(
      (a, b) => {
        if (a.name < b.name) return -1;
        else return 1;
      },
    );
  }

  /* This function is responsible of saving a new Channel and do manage error or
  	redundancy if it happens */
  async saveChannel(
    newChannelEntity: ChannelEntity,
  ): Promise<void | ChannelEntity> {
    return await this.channelRepository.save(newChannelEntity).catch((e) => {
      if (e.code === '23505')
        throw new UnprocessableEntityException(
          'Name of Server already exist. Choose another one.',
        );
      else console.log(e);
      throw new InternalServerErrorException('Saving of new Channel failed.');
    });
  }

  /* This function is mainly used to load a targeted-User, which profile hasn't been loaded yet */
  async getUser(
    id: string,
    inputed_relations: FindOptionsRelations<UserEntity> = undefined,
  ): Promise<UserEntity> {
    const user = await this.userService.findById(id, inputed_relations);

    if (!user)
      throw new UnprocessableEntityException(
        `Cannot find ${id} in database to process`,
      );
    return user;
  }

  async getProtectedChannel(
    channelUUID: string,
    inputed_relations: FindOptionsRelations<ChannelEntity>,
  ): Promise<ChannelEntity> {
    let result = await this.channelRepository.findOne({
      where: {
        id: channelUUID,
      },
      relations: inputed_relations,
      select: {
        id: true,
        name: true, // load this relations for error message in front
        status: true,
        password: true,
      },
    });
    return result;
  }

  async getChannel(
    channelUUID: string,
    inputed_relations: FindOptionsRelations<ChannelEntity> = undefined,
  ): Promise<ChannelEntity> {
    let returned_channel;

    if (inputed_relations) {
      returned_channel = await this.channelRepository.findOne({
        where: {
          id: channelUUID,
        },
        relations: inputed_relations,
      });
    } else {
      returned_channel = await this.channelRepository.findOne({
        where: {
          id: channelUUID,
        },
      });
    }
    if (!returned_channel)
      throw new UnprocessableEntityException(
        "Couldn't find a server with that name. Try again",
      );
    else return returned_channel;
  }

  // get a channel by id (used for message)
  async getChannelById(inputed_id: string): Promise<ChannelEntity> {
    let ret = await this.channelRepository
      .createQueryBuilder('channel')
      .where('channel.id = :id', { id: inputed_id })
      .leftJoin('channel.users', 'users')
      .addSelect('users.id')
      .addSelect('users.username')
      .leftJoin('channel.admins', 'admins')
      .addSelect('admins.id')
      .addSelect('admins.username')
      .leftJoin('channel.owner', 'owner')
      .addSelect('owner.username')
      .addSelect('owner.id')
      .getOne();

    return ret;
  }

  /* This function compares hashed password in db, with the one the user just typed */
  async checkPassword(inputed_password: string, channel_password: string) {
    if (!inputed_password)
      throw new UnauthorizedException('No password inputed');

    if (await bcrypt.compare(inputed_password, channel_password)) return true;
    else throw new UnauthorizedException('Wrong Password.');
  }

  /* This function hashed password with bcrypt and returns it */
  async hashPassword(inputed_password: string): Promise<any> {
    return await bcrypt.hash(inputed_password, await bcrypt.genSalt());
  }

  /* This function generate new channel, and if protected add the password to the DB, if not, throw an
	error. Then channel is saved and returned */
  async createChannel(
    channel: CreateChannelDto,
    user: UserEntity,
  ): Promise<void | ChannelEntity> {
    let newChannel = new ChannelEntity();

    newChannel.name = channel.name;
    newChannel.status = channel.status;
    newChannel.owner = user;
    if (channel.status === 'Protected') {
      if (!channel.password)
        throw new UnprocessableEntityException(
          'Password is required for protected channel',
        );
      else newChannel.password = await this.hashPassword(channel.password);
    }
    return await this.saveChannel(newChannel);
  }

  /* This function allows the user to leave the channel.
	If the leaver is an owner :
	Admin[0] becomes the new owner, if there is no admin[0], user[0] becomes the owner.
	If there are no users, no admins --> the channel is destroyed */
  async leaveChannel(requested_channel: ChannelDto, user: UserEntity) {
    let channel = await this.getChannel(requested_channel.id, {
      owner: true,
      admins: true,
      users: true,
    });

    if (this.isOwner(requested_channel.id, user)) {
      if (channel.admins && channel.admins[0]) {
        channel.owner = channel.admins[0];
        channel.admins = channel.admins.filter(
          (channel_admins) =>
            channel_admins.id !== channel.admins[0].id,
        );
      } else if (channel.users && channel.users[0]) {
        channel.owner = channel.users[0];
        channel.users = channel.users.filter(
          (channel_users) =>
            channel_users.id !== channel.users[0].id,
        );
      } else return await this.deleteChannel(requested_channel, user);
    }
    if (this.isAdmin(requested_channel.id, user))
      channel.admins = channel.admins.filter(
        (channel_admins) => channel_admins.id !== user.id,
      );
    if (this.isMember(requested_channel.id, user))
      channel.users = channel.users.filter(
        (channel_users) => channel_users.id !== user.id,
      );
    return await this.channelRepository.save(channel);
  }

  /* This function delete channel, only if the requester is owner of this channel */
  async deleteChannel(
    requested_channel: ChannelDto,
    user: UserEntity,
  ): Promise<ChannelEntity> {
    if (this.isOwner(requested_channel.id, user)) {
      let to_delete = user.owner_of.find(
        (channel) => channel.id === requested_channel.id,
      );
      return await this.channelRepository.remove(to_delete);
    } else
      throw new ForbiddenException(
        'Only the owner of the channel can delete the channel.',
      );
  }

  /* This function add a user to the channel, only if the requester is not banned of this channel.
	Also it checks password inputed if the channel is protected */
  async joinChannel(
    requested_channel: ChannelDto,
    user: UserEntity,
  ): Promise<ChannelEntity> {
    let returned_channel: ChannelEntity;

    if (
      this.isOwner(requested_channel.id, user) ||
      this.isAdmin(requested_channel.id, user) ||
      this.isMember(requested_channel.id, user)
    )
      throw new UnprocessableEntityException(
        'User is already member or owner of the channel.',
      );

    let channel = await this.getProtectedChannel(requested_channel.id, {
      owner: true,
      users: true,
      banned: true,
    });
    await this.verifyBanned(channel, user.id);

    if (channel.status === 'Protected') {
      returned_channel = await this.joinProtectedChannels(
        requested_channel.password,
        user,
        channel,
      );
    } else returned_channel = await this.joinPublicChannels(user, channel);
    /* This trick allows me to load the channel with the banned entity, but also allows me to send it back without showing the receiver
		the list of banned users, which should only be available to authorized member such as Owner or Admins*/
    returned_channel.banned = null;
    return returned_channel;
  }

  /* This function allows the owner to add or modify the password of a channel, therefore changing its
	status to 'Protected' if it wasn't already the case */
  async addPassword(
    channel_requested: ChannelPasswordDto,
    user: UserEntity,
  ): Promise<ChannelEntity> {
    if (!this.isOwner(channel_requested.id, user))
      throw new ForbiddenException(
        'Only the owner of the channel can add a password',
      );

    let channel = await this.getProtectedChannel(channel_requested.id, {
      owner: true,
    });

    if (channel.status === 'Protected')
      await this.checkPassword(
        channel_requested.current_password,
        channel.password,
      );
    channel.status = 'Protected';
    channel.password = await this.hashPassword(channel_requested.new_password);
    return await this.channelRepository.save(channel);
  }

  /* This function delete the password, therefore changing this channel status to 'Public' */
  async deletePassword(
    channel_requested: ChannelDto,
    user: UserEntity,
  ): Promise<ChannelEntity> {
    if (!this.isOwner(channel_requested.id, user))
      throw new ForbiddenException(
        'Only the owner of the channel can delete a password',
      );

    let channel = await this.getProtectedChannel(channel_requested.id, {
      owner: true,
    });

    if (channel.status === 'Private' || channel.status === 'Public')
      throw new UnprocessableEntityException(
        `Cannot perform that action of this server type: ${channel.status}`,
      );
    if (
      await this.checkPassword(channel_requested.password, channel.password)
    ) {
      channel.status = 'Public';
    }
    return await this.channelRepository.save(channel);
  }

  /* This function unban a User that has been banned earlier on. It verifies that the caller
	has enough clearance for this action */
  async unBanUser(
    request: ChannelActionsDto,
    requester: UserEntity,
  ): Promise<BanEntity> {
    let target = await this.getUser(request.targetId, {
      owner_of: true,
      admin_of: true,
      channels: true,
    });
    this.verifyHierarchy(request.id, requester, target);

    let channel = await this.getChannel(request.id, {
      owner: true,
      admins: true,
      users: true,
      banned: true,
    });
    let banned = this.findBanned(channel, target.id);
    if (!banned)
      throw new UnprocessableEntityException(
        `${target.username} is not banned.`,
      );
    else return (await this.banmuteService.remove(banned)) as BanEntity;
  }

  /* This function allows to ban a user, based on level of clearance of caller.
	Owner can ban anyone in the server. Admins can ban users, but not owner. Users cannot ban.*/
  async banUser(
    request: ChannelActionsDto,
    requester: UserEntity,
  ): Promise<BanEntity> {
    let muted: MuteEntity;
    let userToBan = await this.getUser(request.targetId, {
      owner_of: true,
      admin_of: true,
      channels: true,
    });

    this.verifyHierarchy(request.id, requester, userToBan);

    let channel = await this.getChannel(request.id, {
      owner: true,
      admins: true,
      users: true,
      banned: true,
      muted: true,
    });
    if (this.findBanned(channel, userToBan.id))
      throw new UnprocessableEntityException(
        `${userToBan.username} is already banned`,
      );

    this.verifyIfMember(request.id, userToBan);

    if ((muted = this.findMuted(channel, userToBan.id)))
      (await this.banmuteService.remove(muted)) as MuteEntity;
    channel.admins = channel.admins.filter(
      (admin) => admin.id !== request.targetId,
    );
    channel.users = channel.users.filter(
      (user) => user.id !== request.targetId,
    );
    await this.channelRepository.save(channel);

    return await this.banmuteService.generate(
      BanEntity,
      request.duration,
      channel,
      userToBan,
    );
  }

  /* This function allows to Unmute a user that has been muted earlier on. */
  async unMuteUser(
    request: ChannelActionsDto,
    requester: UserEntity,
  ): Promise<MuteEntity> {
    const userToUnMute = await this.getUser(request.targetId, {
      owner_of: true,
      admin_of: true,
      channels: true,
    });
    this.verifyHierarchy(request.id, requester, userToUnMute);
    this.verifyIfMember(request.id, userToUnMute);

    let channel = await this.getChannel(request.id, {
      owner: true,
      admins: true,
      users: true,
      muted: true,
    });
    let muted = this.findMuted(channel, userToUnMute.id);
    if (!muted)
      throw new UnprocessableEntityException(`${request.targetId} is not muted.`);
    else return (await this.banmuteService.remove(muted)) as MuteEntity;
  }

  /* This function allows to muteUser with the same hierarchy rules of BanUser. */
  async muteUser(
    request: ChannelActionsDto,
    requester: UserEntity,
  ): Promise<MuteEntity> {
    const userToMute = await this.getUser(request.targetId, {
      owner_of: true,
      admin_of: true,
      channels: true,
    });
    this.verifyHierarchy(request.id, requester, userToMute);
    this.verifyIfMember(request.id, userToMute);

    let channel = await this.getChannel(request.id, {
      owner: true,
      admins: true,
      users: true,
      muted: true,
    });

    if (this.findMuted(channel, userToMute.id))
      throw new UnprocessableEntityException(
        `${userToMute.username} is already muted`,
      );

    if (channel.admins.find((elem) => elem.id === request.targetId)) {
      channel.admins = channel.admins.filter(
      (elem) => elem.id !== request.targetId);
      channel.users = [...channel.users, userToMute];
    }
    await this.channelRepository.save(channel);

    return await this.banmuteService.generate(
      MuteEntity,
      request.duration,
      channel,
      userToMute,
    );
  }

  async joinPublicChannels(
    user: UserEntity,
    channel: ChannelEntity,
  ): Promise<ChannelEntity> {
    this.addToUsers(channel, user);
    return await this.channelRepository.save(channel);
  }

  async joinProtectedChannels(
    password: string,
    user: UserEntity,
    channel: ChannelEntity,
  ): Promise<ChannelEntity> {
    if (await this.checkPassword(password, channel.password))
      return await this.joinPublicChannels(user, channel);
  }

  async makeAdmin(
    req_channel: ChannelActionsDto,
    user: UserEntity,
  ): Promise<IAdmin> {
    const future_admin = await this.getUser(req_channel.targetId, {
      owner_of: true,
      admin_of: true,
      channels: true,
    });

    if (!this.isOwner(req_channel.id, user))
      throw new UnauthorizedException(
        `Only owner of channel can promote ${req_channel.targetId} to admin`,
      );
    if (this.isOwner(req_channel.id, future_admin))
      throw new UnauthorizedException(
        `Owner ${req_channel.targetId} is already admin by default of the channel ${req_channel.id}`,
      );
    if (this.isAdmin(req_channel.id, future_admin))
      throw new UnprocessableEntityException(
        'This member is already an admin of this channel.',
      );
    this.verifyIfMember(req_channel.id, future_admin);

    let channel = await this.getChannel(req_channel.id, {
      admins: true,
      muted: true,
      users: true,
    });
    await this.verifyMuted(channel, req_channel.targetId);

    //TODO REMOVE IF NOT USED (duplicate use of findMuted)
    if (this.findMuted(channel, req_channel.targetId))
      throw new UnprocessableEntityException(
        'Cannot make admin a muted member',
      );

    this.addToAdmins(channel, future_admin);
    channel.users = channel.users.filter(
      (user) => user.id !== future_admin.id,
    );
    return {
      target: future_admin,
      channel: await this.channelRepository.save(channel)
    };
  }

  async revokeAdmin(
    req_channel: ChannelActionsDto,
    user: UserEntity,
  ): Promise<IAdmin> {
    if (!this.isOwner(req_channel.id, user))
      throw new UnauthorizedException(
        `Only owner of channel can revoke administration rights of ${req_channel.targetId}`,
      );

    let target = await this.getUser(req_channel.targetId, {
      admin_of: true,
      channels: true,
    });

    if (!this.isAdmin(req_channel.id, target))
      throw new UnprocessableEntityException(
        `${req_channel.targetId} is not an admin of ${req_channel.id}}`,
      );
    let channel = await this.getChannel(req_channel.id, {
      admins: true,
      users: true,
    });
    channel.admins = channel.admins.filter(
      (elem) => elem.id !== target.id,
    );
    this.addToUsers(channel, target);
    return {
      target: target,
      channel: await this.channelRepository.save(channel)
    };
  }

  isOwner(searched_channel: string, user: UserEntity): boolean {
    if (
      user.owner_of &&
      user.owner_of.find((channel) => channel.id === searched_channel)
    )
      return true;
    else return false;
  }

  isAdmin(searched_channel: string, user: UserEntity) {
    if (
      user.admin_of &&
      user.admin_of.find((channel) => channel.id === searched_channel)
    )
      return true;
    else return false;
  }

  isMember(searched_channel: string, user: UserEntity): boolean {
    if (
      user.channels &&
      user.channels.find((channel) => channel.id === searched_channel)
    )
      return true;
    else return false;
  }

  verifyHierarchy(
    channel: string,
    requester: UserEntity,
    targeted_user: UserEntity,
  ) {
    if (requester.id === targeted_user.id)
      throw new ForbiddenException('Cannot apply this action to yourself');
    if (!this.isOwner(channel, requester)) {
      if (!this.isAdmin(channel, requester))
        throw new ForbiddenException(
          'Only an admin or owner of the channel can ban/unban other members.',
        );
      if (
        this.isOwner(channel, targeted_user) ||
        this.isAdmin(channel, targeted_user)
      )
        throw new ForbiddenException(
          'An admin cannot ban/unban another admin or owner.',
        );
    }
  }

  verifyIfMember(channel: string, target: UserEntity) {
    if (!this.isMember(channel, target) && !this.isAdmin(channel, target))
      throw new UnprocessableEntityException(
        `${target.username} is not a member of ${channel}`,
      );
  }

  async verifyBanned(
    channel: ChannelEntity,
    targetId: string,
  ): Promise<BanEntity> {
    let banned: BanEntity;
    if ((banned = this.findBanned(channel, targetId))) {
      if (!this.banmuteService.checkDuration(banned))
        throw new ForbiddenException(`Target is banned from ${channel.name}`);
      else return (await this.banmuteService.remove(banned)) as BanEntity;
    }
  }

  findBanned(channel: ChannelEntity, targetId: string): BanEntity {
    if (channel.banned) {
      let banned = channel.banned.find(
        (banned_guy) => banned_guy.user.id === targetId,
      );
      if (banned) return banned;
    }
    return null;
  }

  findMuted(channel: ChannelEntity, targetId: string): MuteEntity {
    if (channel.muted) {
      let muted = channel.muted.find(
        (muted_guy) => muted_guy.user.id === targetId,
      );
      if (muted) return muted;
    }
    return null;
  }

  async verifyMuted(
    channel: ChannelEntity,
    target: string,
  ): Promise<MuteEntity> {
    let muted: MuteEntity;
    if ((muted = this.findMuted(channel, target))) {
      if (!this.banmuteService.checkDuration(muted))
        throw new ForbiddenException(`${target} is muted.`);
      else return (await this.banmuteService.remove(muted)) as MuteEntity;
    }
  }

  addToUsers(channel: ChannelEntity, user: UserEntity) {
    if (channel.users) channel.users.push(user);
    else channel.users = [user];
  }

  addToAdmins(channel: ChannelEntity, user: UserEntity) {
    if (channel.admins) channel.admins.push(user);
    else channel.admins = [user];
  }

  async getChannelsByUser(userId: string): Promise<ChannelEntity[]> {

    // get all channels where user is member or admin or owner
    return await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.users', 'users')
      .leftJoinAndSelect('channel.admins', 'admins')
      .leftJoinAndSelect('channel.owner', 'owner')
      .where('users.id = :userId', { userId: userId })
      .orWhere('admins.id = :userId', { userId: userId })
      .orWhere('owner.id = :userId', { userId: userId })
      .getMany();
  }

  //DELETEMEAFTERTESTING :
  async createFalseUser(username: string): Promise<UserEntity> {
    let user = new UserEntity();
    user.username = username;
    user.email = username + '@student.42.fr';
    user = await this.userService.add(user);
    return await this.getUser(user.id, { channels: true });
  }

  async getAllChannels(): Promise<ChannelEntity[]> {
    return await this.channelRepository.find({
      relations: {
        owner: true,
        users: true,
      },
    });
  }
}
