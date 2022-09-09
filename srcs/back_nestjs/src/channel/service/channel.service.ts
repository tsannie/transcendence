import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelEntity } from '../models/channel.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private allChannels: Repository<ChannelEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  getAllChannels() : Observable<ChannelEntity[]> {
    return from(this.allChannels.find(
      {
        relations: ["owner"],
      },
      ));
  }

  createChannel(channel: ChannelDto, user : UserEntity) : Observable<ChannelEntity> {
    let newChannel = new ChannelEntity();

    newChannel.name = channel.name;
    newChannel.status = channel.status;
    newChannel.owner =  user;

    if (channel.password){
      let salt = bcrypt.genSalt();

      newChannel.password = bcrypt.hash(channel.password, salt);
      newChannel.salt = salt;
    }

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
