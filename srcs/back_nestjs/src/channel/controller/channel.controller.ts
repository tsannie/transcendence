import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  Request,
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
export class ChannelController {
  constructor(private channelService: ChannelService) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('datas')
  async getDatas(
    @Query() query_channel: ChannelDto,
    @Request() req,
  ): Promise<{
    status: string;
    data: ChannelEntity;
  }> {
    return await this.channelService.getDatas(query_channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('userList')
  async getUserList(@Request() req): Promise<ChannelEntity[]> {
    return await this.channelService.getUserList(req.user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtTwoFactorGuard)
  @Get('list')
  async getList(@Request() req): Promise<ChannelEntity[]> {
    return await this.channelService.getList(req.user);
  }

  //CREATE A CHANNEL, LINKED TO AN OWNER (THE REQUESTER OF THE CREATION)
  @UseGuards(JwtTwoFactorGuard)
  @Post('create')
  async createChannel(
    @Body() channel: CreateChannelDto,
    @Request() req,
  ): Promise<void | ChannelEntity> {
    return await this.channelService.createChannel(channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('banUser')
  async banUser(
    @Body() ban_request: ChannelActionsDto,
    @Request() req,
  ): Promise<BanEntity> {
    return await this.channelService.banUser(ban_request, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('unBanUser')
  async unBanUser(
    @Body() ban_request: ChannelActionsDto,
    @Request() req,
  ): Promise<BanEntity> {
    return await this.channelService.unBanUser(ban_request, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('makeAdmin')
  async makeAdmin(
    @Body() channel: ChannelActionsDto,
    @Request() req,
  ): Promise<ChannelEntity> {
    return await this.channelService.makeAdmin(channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('muteUser')
  async muteUser(
    @Body() channel: ChannelActionsDto,
    @Request() req,
  ): Promise<MuteEntity> {
    return await this.channelService.muteUser(channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('unMuteUser')
  async unMuteUser(
    @Body() channel: ChannelActionsDto,
    @Request() req,
  ): Promise<MuteEntity> {
    return await this.channelService.unMuteUser(channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('revokeAdmin')
  async revokeAdmin(
    @Body() channel: ChannelActionsDto,
    @Request() req,
  ): Promise<ChannelEntity> {
    return await this.channelService.revokeAdmin(channel, req.user);
  }

  //ENTER IN A PUBLIC ROOM,
  @UseGuards(JwtTwoFactorGuard)
  @Post('join')
  async joinChannel(@Body() query_channel: ChannelDto, @Request() req) {
    return await this.channelService.joinChannel(query_channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('leave')
  async leaveChannel(@Body() query_channel: ChannelDto, @Request() req) {
    return await this.channelService.leaveChannel(query_channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('delete')
  async deleteChannel(@Body() query_channel: ChannelDto, @Request() req) {
    return await this.channelService.deleteChannel(query_channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('addPassword')
  async addPassword(@Body() channel: ChannelPasswordDto, @Request() req) {
    return await this.channelService.addPassword(channel, req.user);
  }

  //USE SAME FUNCTION THAN ADDPASSWORD
  @UseGuards(JwtTwoFactorGuard)
  @Post('modifyPassword')
  async modifyPassword(@Body() channel: ChannelPasswordDto, @Request() req) {
    return await this.channelService.addPassword(channel, req.user);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('deletePassword')
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
  async addFalseUser(@Body() data) {
    let new_user = await this.channelService.createFalseUser(data.username);
    return await this.channelService.joinChannel(data.channel, new_user);
  }

  //RETURN ALL ROOMS AVAILABLE (PUBLIC/PRIVATE/ETC...)
  @Get('all')
  async getAllChannels(): Promise<ChannelEntity[]> {
    return this.channelService.getAllChannels();
  }
}
