import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { CreateChannelDto } from '../dto/createchannel.dto';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelEntity } from '../models/channel.entity';
import { ChannelService } from '../service/channel.service';
import { UserEntity } from 'src/user/models/user.entity';
import { BanMuteDto } from '../dto/banmute.dto';

@Controller('channel')
export class ChannelController {
	constructor(private channelService: ChannelService,
	) {}

	@UseGuards( AuthGuard('jwt') )
	@Get("privateData")
	async getPrivateData(@Query() query_channel : ChannelDto, @Request() req) : Promise<ChannelEntity> {
		return await this.channelService.getPrivateData(query_channel, req.user);
	}

	//CREATE A CHANNEL, LINKED TO AN OWNER (THE REQUESTER OF THE CREATION)
	@UseGuards( AuthGuard('jwt') )
	@Post('createChannel')
	async createChannel(@Body() channel: CreateChannelDto, @Request() req): Promise<void | ChannelEntity> {
		return await this.channelService.createChannel(channel, req.user);
	}

	@UseGuards( AuthGuard('jwt') )
	@Post('banUser')
	async banUser(@Body() ban_request: BanMuteDto, @Request() req) : Promise<ChannelEntity> {
		return await this.channelService.banUser(ban_request, req.user);
	}

	@UseGuards( AuthGuard('jwt') )
	@Post('unBanUser')
	async unBanUser(@Body() ban_request: BanMuteDto, @Request() req) : Promise<ChannelEntity> {
		return await this.channelService.unBanUser(ban_request, req.user);
	}

	//ENTER IN A PUBLIC ROOM, 
	@UseGuards( AuthGuard('jwt') )
	@Get( 'joinChannel' )
	async joinChannel( @Query() query_channel : ChannelDto, @Request() req) {
		return await this.channelService.joinChannel(query_channel, req.user);
	}

	@UseGuards( AuthGuard('jwt') )
	@Get( 'leaveChannel' )
	async leaveChannel( @Query() query_channel : ChannelDto, @Request() req) {
		return await this.channelService.leaveChannel(query_channel, req.user);
	}

	@UseGuards( AuthGuard('jwt') )
	@Get( 'deleteChannel' )
	async deleteChannel(@Query() query_channel : ChannelDto, @Request() req) {
		return await this.channelService.deleteChannel(query_channel, req.user);
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
  	@Post("falseUsergenerator")
  	async addFalseUser( @Body() data ){
		let new_user = await this.channelService.createFalseUser(data.username);
		return await this.channelService.joinChannel(data.channel, new_user);
	}

	@Post("banUser")

	@Post('password')
	async comparePassword( @Body() data ){
		return await this.channelService.checkPassword(data.room_name, data.password);
	}

  //RETURN ALL ROOMS AVAILABLE (PUBLIC/PRIVATE/ETC...)
	@Get('all')
	async getAllChannels(): Promise<ChannelEntity[]> {
		return this.channelService.getAllChannels();
	}
}
