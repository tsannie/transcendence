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
  async getAllDms(data: string): Promise<void | DmEntity[]> {
    /* console.log('users = ', user);
    try {
      console.log("avant le find");
      const dms = await this.dmRepository.find({
        where: [{ user1: user }],
      });
      console.log("apres le find");
      return dms;
    } catch (err) {
      throw new InternalServerErrorException(err);
    } */
    return;
  }

  // get a dm by id
  async getDmById(id: number): Promise<void | DmEntity> {
    try {
      const dm = await this.dmRepository.findOne(id);
      return dm;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  // create a new dm
  async createDm(dm: CreateDmDto, user: UserEntity): Promise<void | DmEntity> {
    console.log('createDm');
    const newUser2 = await this.userService.findByName(dm.targetUsername);

    if (newUser2 === undefined) {
      throw new UnprocessableEntityException('User not found');
    }

    console.log('newUser2 = ', newUser2);
    // check if dm already exists
    /* const dmExists = await this.dmRepository.findOne({
      where: {
        users: [user, newUser2]
      }
    });
    if (dmExists)
      return dmExists; */

    let newDm = new DmEntity();

    newDm.users = [user, newUser2];
    newDm.messages = [];
    console.log('newDm = ', newDm);
    return await this.dmRepository.save(newDm);
  }
}
