import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Query,
  Req,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateChannelDto } from '../dto/createchannel.dto';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelEntity } from '../models/channel.entity';
import { ChannelService } from '../service/channel.service';
import { ChannelActionsDto } from '../dto/channelactions.dto';
import { ChannelPasswordDto } from '../dto/channelpassword.dto';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { BanEntity, MuteEntity } from '../models/ban.entity';
import { Request } from 'express';
import { MessageGateway } from 'src/message/message.gateway';
import { UserEntity } from 'src/user/models/user.entity';
import { ChannelInvitationDto } from '../dto/channelinvitation.dto';

@Controller('channel')
@UseInterceptors(ClassSerializerInterceptor)
export class ChannelController {
  constructor(
    private channelService: ChannelService,
    @Inject(forwardRef(() => MessageGateway))
    private messageGateway: MessageGateway,
  ) {}

  @Get('datas')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getDatas(
    @Query() query_channel: ChannelDto,
    @Req() req: Request,
  ): Promise<{
    status: string;
    data: ChannelEntity;
  }> {
    return await this.channelService.getDatas(query_channel, req.user);
  }

  @Get('userList')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getUserList(@Req() req: Request): Promise<ChannelEntity[]> {
    return await this.channelService.getUserList(req.user);
  }

  @Get('list')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getList(@Req() req: Request): Promise<ChannelEntity[]> {
    return await this.channelService.getList(req.user);
  }

  //CREATE A CHANNEL, LINKED TO AN OWNER (THE REQUESTER OF THE CREATION)
  @Post('create')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async createChannel(
    @Body() channel: CreateChannelDto,
    @Req() req: Request,
  ): Promise<void | ChannelEntity> {
    // const channelCreated: ChannelEntity | void =

      const newChannel = await this.channelService.createChannel(channel, req.user);

      if (newChannel)
        this.messageGateway.createChannel(req.user, newChannel.id);
      return newChannel;
  }

  @Post('ban')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async banUser(
    @Body() ban_request: ChannelActionsDto,
    @Req() req: Request,
  ): Promise<BanEntity> {
    const bannedUser = await this.channelService.banUser(ban_request, req.user);

    this.messageGateway.banUser(bannedUser);
    return bannedUser;
  }

  @Post('unban')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async unBanUser(
    @Body() ban_request: ChannelActionsDto,
    @Req() req: Request,
  ): Promise<BanEntity> {
    const unBannedUser = await this.channelService.unBanUser(ban_request, req.user);

    this.messageGateway.unBanUser(unBannedUser, ban_request.id);
    return unBannedUser;
  }

  @Post('mute')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async muteUser(
    @Body() channel: ChannelActionsDto,
    @Req() req: Request,
  ) : Promise<MuteEntity>{
    const userMuted: MuteEntity = await this.channelService.muteUser(channel, req.user);

    this.messageGateway.muteUser(userMuted);
    return userMuted;
  }

  @Post('unmute')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async unMuteUser(
    @Body() channel: ChannelActionsDto,
    @Req() req: Request,
  ): Promise<MuteEntity> {
    const unmutedUser : MuteEntity = await this.channelService.unMuteUser(channel, req.user);

    this.messageGateway.unMuteUser(unmutedUser, channel.id);
    return unmutedUser;
  }

  @Post('makeAdmin')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async makeAdmin(
    @Body() channel: ChannelActionsDto,
    @Req() req: Request,
  ): Promise<ChannelEntity> {
    const newAdmin = await this.channelService.makeAdmin(channel, req.user);

    this.messageGateway.makeAdmin(newAdmin.target, newAdmin.channel.id);
    return newAdmin.channel;
  }

  @Post('revokeAdmin')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async revokeAdmin(
    @Body() channel: ChannelActionsDto,
    @Req() req: Request,
  ): Promise<ChannelEntity> {
    const oldAdmin = await this.channelService.revokeAdmin(channel, req.user);

    this.messageGateway.revokeAdmin(oldAdmin.target, oldAdmin.channel.id);
    return oldAdmin.channel;
  }

  //ENTER IN A PUBLIC ROOM,
  @Post('join')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async joinChannel(@Body() query_channel: ChannelDto, @Req() req: Request) {
    //return await this.channelService.joinChannel(query_channel, req.user);
    const channel: ChannelEntity = await this.channelService.joinChannel(query_channel, req.user)

    this.messageGateway.joinChannel(req.user, channel.id);
    return channel;
  }

  @Post('leave')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async leaveChannel(@Body() query_channel: ChannelDto, @Req() req: Request) {
    //return await this.channelService.leaveChannel(query_channel, req.user);
    const channel: ChannelEntity = await this.channelService.leaveChannel(query_channel, req.user)

    console.log("channel after delete in leave: ", channel);
    if (!channel.id)
      this.messageGateway.deleteChannel(query_channel.id);
    else
      this.messageGateway.leaveChannel(req.user, channel);
    return channel;
  }

  @Post('delete')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async deleteChannel(@Body() query_channel: ChannelDto, @Req() req: Request) {
    //return await this.channelService.deleteChannel(query_channel, req.user);
    const old_channel = await this.channelService.deleteChannel(query_channel, req.user);

    this.messageGateway.deleteChannel(query_channel.id);
    return old_channel;
  }

  @Post('invite')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async inviteChannel(
    @Body() query_channel: ChannelInvitationDto,
    @Req() req: Request,
  ): Promise<ChannelEntity> {
    const channel: ChannelEntity = await this.channelService.inviteChannel(query_channel, req.user);

    // find the user to invite with his id
    await this.messageGateway.inviteChannel(query_channel.targetUsername, channel);
    return channel;
  }

  @Post('addPassword')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async addPassword(@Body() channel: ChannelPasswordDto, @Req() req: Request) {
    return await this.channelService.addPassword(channel, req.user);
  }

  //USE SAME FUNCTION THAN ADDPASSWORD
  @Post('modifyPassword')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async modifyPassword(
    @Body() channel: ChannelPasswordDto,
    @Req() req: Request,
  ) {
    return await this.channelService.addPassword(channel, req.user);
  }

  @Post('deletePassword')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async deletePassword(@Body() channel: ChannelDto, @Req() req: Request) {
    return await this.channelService.deletePassword(channel, req.user);
  }

  /*PLEASE DELETE THESE ROUTE LATER, TEST ROUTES*/

  /*to use that route, send an object as such:
	{
		ChannelDTO{
			name
		},
		username
	}
	*/
  @Post('falseUsergenerator')
  @SerializeOptions({ groups: ['user'] })
  async addFalseUser(@Body() data) {
    let new_user = await this.channelService.createFalseUser(data.username);
    return await this.channelService.joinChannel(data.channel, new_user);
  }

  //RETURN ALL ROOMS AVAILABLE (PUBLIC/PRIVATE/ETC...)
  @Get('all')
  @SerializeOptions({ groups: ['user'] })
  async getAllChannels(): Promise<ChannelEntity[]> {
    return this.channelService.getAllChannels();
  }
}
