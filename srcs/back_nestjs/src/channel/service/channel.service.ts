import {
  Body,
  Catch,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { UserEntity } from 'src/user/models/user.entity';
import { MetadataAlreadyExistsError, Repository } from 'typeorm';
import { ChannelDto } from '../dto/channel.dto';
import { ChannelEntity } from '../models/channel.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
@Catch()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private allChannels: Repository<ChannelEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  getAllChannels() : Observable<ChannelEntity[]> {
    return from(this.allChannels.find(
      {
        relations: ["owner"],
      },
      ));
  }

  //this function is responsible of saving a new Channel and do manage error or redundancy if it happens
  async saveChannel(newChannelEntity : ChannelEntity) : Promise<void | ChannelEntity>
  {
	return await this.allChannels.save(newChannelEntity).catch( (e) => {
		if (e.code === "23505")
			throw new UnprocessableEntityException("Name of Server aleready exist. Choose another one.");
		else
			console.log(e)
			throw new InternalServerErrorException("Saving of new Channel failed.");
		});
  }

  async createChannel(channel: ChannelDto, user : UserEntity) : Promise<void | ChannelEntity> {
    let newChannel = new ChannelEntity();

    newChannel.name = channel.name;
    newChannel.status = channel.status;
    newChannel.owner =  user;
    if (channel.status === "Protected" && channel.password) {
      let salt = await bcrypt.genSalt();

      newChannel.password = await bcrypt.hash(channel.password, parseInt(salt));
      newChannel.salt = salt;
    }

    return await this.saveChannel(newChannel);
  }

  handleChannels(data: ChannelDto): void {
    //this.createChannel(data);
    if (data.status === 'Public') {
      this.handlePublicChannels();
    } else if (data.status === 'Private') {
      this.handlePrivateChannels();
    } else if (data.status === 'Protected') {
      this.handleProtectedChannels();
    } else {
      console.log('error');
    }
  }

  handlePublicChannels(): void {
    console.log('public channels');
  }
  handlePrivateChannels(): void {
    console.log('private channels');
  }
  handleProtectedChannels(): void {
    console.log('protected channels');
  }
}
