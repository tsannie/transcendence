import { Body, Controller, Get, Post } from '@nestjs/common';
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

  @Post('createChannel')
  async createChannel(@Body() channel: ChannelDto): Promise<Observable<ChannelEntity>> {
    return await this.channelService.createChannel(channel);
  }
}