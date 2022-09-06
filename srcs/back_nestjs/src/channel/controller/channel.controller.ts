import { Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { IChannel } from '../models/channel.interface';
import { ChannelService } from '../service/channel.service';

@Controller('channel')
export class ChannelController {
  constructor(private channelService: ChannelService,
    ) {}

  @Get('all')
  getAllChannels(): Observable<IChannel[]> {
    return this.channelService.getAllChannels();
  }

  @Post('add')
  add(channel: IChannel): Observable<IChannel> {
    return this.channelService.add(channel);
  }
}