import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Request,
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

@Controller('channel')
@UseInterceptors(ClassSerializerInterceptor)
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @Get('datas')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getDatas(
    @Query() query_channel: ChannelDto,
    @Request() req,
  ): Promise<{
    status: string;
    data: ChannelEntity;
  }> {
    return await this.channelService.getDatas(query_channel, req.user);
  }

  @Get('userList')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getUserList(@Request() req): Promise<ChannelEntity[]> {
    return await this.channelService.getUserList(req.user);
  }

  @Get('list')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getList(@Request() req): Promise<ChannelEntity[]> {
    return await this.channelService.getList(req.user);
  }

  //CREATE A CHANNEL, LINKED TO AN OWNER (THE REQUESTER OF THE CREATION)
  @Post('create')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async createChannel(
    @Body() channel: CreateChannelDto,
    @Request() req,
  ): Promise<void | ChannelEntity> {
    return await this.channelService.createChannel(channel, req.user);
  }

  @Post('banUser')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async banUser(
    @Body() ban_request: ChannelActionsDto,
    @Request() req,
  ): Promise<BanEntity> {
    return await this.channelService.banUser(ban_request, req.user);
  }

  @Post('unBanUser')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async unBanUser(
    @Body() ban_request: ChannelActionsDto,
    @Request() req,
  ): Promise<BanEntity> {
    return await this.channelService.unBanUser(ban_request, req.user);
  }

  @Post('makeAdmin')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async makeAdmin(
    @Body() channel: ChannelActionsDto,
    @Request() req,
  ): Promise<ChannelEntity> {
    return await this.channelService.makeAdmin(channel, req.user);
  }

  @Post('muteUser')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async muteUser(
    @Body() channel: ChannelActionsDto,
    @Request() req,
  ): Promise<MuteEntity> {
    return await this.channelService.muteUser(channel, req.user);
  }

  @Post('unMuteUser')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async unMuteUser(
    @Body() channel: ChannelActionsDto,
    @Request() req,
  ): Promise<MuteEntity> {
    return await this.channelService.unMuteUser(channel, req.user);
  }

  @Post('revokeAdmin')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async revokeAdmin(
    @Body() channel: ChannelActionsDto,
    @Request() req,
  ): Promise<ChannelEntity> {
    return await this.channelService.revokeAdmin(channel, req.user);
  }

  //ENTER IN A PUBLIC ROOM,
  @Post('join')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async joinChannel(@Body() query_channel: ChannelDto, @Request() req) {
    return await this.channelService.joinChannel(query_channel, req.user);
  }

  @Post('leave')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async leaveChannel(@Body() query_channel: ChannelDto, @Request() req) {
    return await this.channelService.leaveChannel(query_channel, req.user);
  }

  @Post('delete')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async deleteChannel(@Body() query_channel: ChannelDto, @Request() req) {
    return await this.channelService.deleteChannel(query_channel, req.user);
  }

  @Post('addPassword')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async addPassword(@Body() channel: ChannelPasswordDto, @Request() req) {
    return await this.channelService.addPassword(channel, req.user);
  }

  //USE SAME FUNCTION THAN ADDPASSWORD
  @Post('modifyPassword')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async modifyPassword(@Body() channel: ChannelPasswordDto, @Request() req) {
    return await this.channelService.addPassword(channel, req.user);
  }

  @Post('deletePassword')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async deletePassword(@Body() channel: ChannelDto, @Request() req) {
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
