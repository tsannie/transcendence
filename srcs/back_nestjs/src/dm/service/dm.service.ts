import { Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import { DmEntity } from '../models/dm.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmEntity)
    private dmRepository: Repository<DmEntity>,
  ) {}

  // save mp in db with unprocessable exception if error
  async saveDm(dm: DmEntity): Promise<void | DmEntity> {
    try {
      return await this.dmRepository.save(dm);
    } catch (e) {
      if (e.code === '23505') {
        throw new UnprocessableEntityException('Name of Server already exist. Choose another one.');
      } else {
        console.log(e);
        throw new InternalServerErrorException('Saving of new Channel failed.');
      }
    }
  }


  // create a new dm
  /* async createDm(channel: CreateDmDto, user: UserEntity): Promise<void | DmEntity> {
    let dm = new DmEntity();

    dm.name = channel.name;
    dm.users = [user];
    dm.messages = [];
    return await dm.save();
  } */
}
