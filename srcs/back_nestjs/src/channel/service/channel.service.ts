import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ChannelEntity } from '../models/channel.entity';
import { IChannel } from '../models/channel.interface';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private allChannels: Repository<ChannelEntity>,
  ) {}
  getAllChannels() : Observable<IChannel[]> {
    return from(this.allChannels.find());
  }

  add(channel: IChannel): Observable<IChannel> {
    return from(this.allChannels.save(channel));
  }

  handleChannels(data: IChannel) : void {
    this.add(data);
    if (data.status === 'Public') {
      this.handlePublicChannels();
    }
    else if (data.status === 'Private') {
      this.handlePrivateChannels();
    }
    else if (data.status === 'Protected') {
      this.handleProtectedChannels();
    }
    else {
      console.log("error");
    }
  }

  handlePublicChannels() : void {
    console.log("public channels")
  }
  handlePrivateChannels() : void {
    console.log("private channels")
  }
  handleProtectedChannels() : void {
    console.log("protected channels")
  }
}
