import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ChannelDto } from '../dto/channel.dto';
import { CreateChannelDto } from '../dto/createchannel.dto';
import { ChannelEntity } from '../models/channel.entity';
import { ChannelService } from '../service/channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService,
    ) {}

  //CREATE A CHANNEL, LINKED TO AN OWNER (THE REQUESTER OF THE CREATION)
  @UseGuards( AuthGuard('jwt') )
  @Post('createChannel')
  async createChannel(@Body() channel: ChannelDto, @Request() req): Promise<void | ChannelEntity> {
    return await this.channelService.createChannel(channel, req.user);
  }

  //ENTER IN A PUBLIC ROOM, 
  @UseGuards( AuthGuard('jwt') )
  @Get( 'joinChannel' )
  async joinChannel( @Query() query_channel : CreateChannelDto, @Request() req) {
    return await this.channelService.joinChannel(query_channel, req.user);
  }









/*PLEASE DELETE THESE ROUTE LATER*/
  //TEST ROUTE, NEED TO DELETE IT
  @Post('password')
  async comparePassword( @Body() data ){
	return await this.channelService.checkPassword(data.room_name, data.password);
  }

  //RETURN ALL ROOMS AVAILABLE (PUBLIC/PRIVATE/ETC...)
  @Get('all')
  getAllChannels(): Observable<ChannelEntity[]> {
    return this.channelService.getAllChannels();
  }
}
