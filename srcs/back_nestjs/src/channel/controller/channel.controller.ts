import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelEntity } from '../models/channel.entity';
import { ChannelService } from '../service/channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService,
    ) {}

  //RETURN ALL ROOMS AVAILABLE (PUBLIC/PRIVATE/ETC...)
  @Get('all')
  getAllChannels(): Observable<ChannelEntity[]> {
    return this.channelService.getAllChannels();
  }

  //CREATE A CHANNEL, LINKED TO AN OWNER (THE REQUESTER OF THE CREATION)
  @UseGuards( AuthGuard('jwt') )
  @Post('createChannel')
  createChannel(@Body() channel: ChannelDto, @Request() req): Observable<ChannelEntity> {
    return this.channelService.createChannel(channel, req.user);
  }

  //ENTER IN A PUBLIC ROOM, 
  @UseGuards( AuthGuard('jwt') )
  @Get( 'joinChannel' )
  joinChannel( @Query() queryparams : string, @Request() req) {
    // return this.channelService.enterPublicChannel(req);
  }

}
