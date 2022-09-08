import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelEntity } from '../models/channel.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private allChannels: Repository<ChannelEntity>,
  ) {}
  getAllChannels() : Observable<ChannelEntity[]> {
    return from(this.allChannels.find());
  }

  createChannel(channel: ChannelDto): Observable<ChannelEntity> {
    console.log("allo");
    console.log(channel);
    let newChannel = new ChannelEntity();

<<<<<<< HEAD
<<<<<<< HEAD
    newChannel.name = channel.name;
    newChannel.status = channel.status;

    //newChannel.ownerid = channel.ownerid;
=======
    //newChannel.name = channel.name;
=======
    newChannel.name = channel.name;
>>>>>>> backend route for channel creation working. starting to create foreign keys
    newChannel.status = channel.status;
    newChannel.ownerid = channel.ownerid;
>>>>>>> [+] change createChannel from socket to req api

    return from(this.allChannels.save(newChannel));
  }

  handleChannels(data: ChannelDto) : void {
    //this.createChannel(data);
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
