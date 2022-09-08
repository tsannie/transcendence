import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelEntity } from '../models/channel.entity';
import { ChannelService } from '../service/channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService,
    ) {}

  @Get('all')
  getAllChannels(): Observable<ChannelEntity[]> {
    return this.channelService.getAllChannels();
  }

  @UseGuards( AuthGuard('jwt') )
  @Post('createChannel')
  createChannel(@Body() channel: ChannelDto, @Request() req): Observable<ChannelEntity> {
    return this.channelService.createChannel(channel, req.user);
  }
}