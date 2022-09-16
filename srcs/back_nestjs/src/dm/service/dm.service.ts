import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { CreateDmDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmEntity)
    private dmRepository: Repository<DmEntity>,

    private readonly userService: UserService,
  ) {}

  // get all conversations of a user
  async getAllDms(user: UserEntity): Promise<void | DmEntity[]> {
    console.log('users = ', user);
    try {
      console.log("avant le find");
      //const dms = await this.dmRepository.find({
      //where: [{ user1: user }, { user2: user }],
      //});
      console.log("apres le find");
      //return dms;
      return ;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  // create a new dm
  async createDm(channel: CreateDmDto, user: UserEntity): Promise<void | DmEntity> {

    const newUser2 = await this.userService.findByName(channel.targetUsername);

    if (newUser2 === undefined) {
      throw new UnprocessableEntityException('User not found');
    }

    // check if dm already exists
    const dmExists = await this.dmRepository.findOne({
      where: {
        users: [user, newUser2]
      }
    });
    if (dmExists)
      return dmExists;

    let dm = new DmEntity();

    dm.users = [user, newUser2];
    dm.messages = [];
    return await this.dmRepository.save(dm);
  }
}
