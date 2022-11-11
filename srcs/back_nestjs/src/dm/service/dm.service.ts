import { forwardRef, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { In, Repository } from 'typeorm';
import { DmTargetDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmEntity)
    private dmRepository: Repository<DmEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async checkifBlocked(user: UserEntity, target: string): Promise<UserEntity> {
    let user2 = await this.userService.findById(target, { blocked: true });

    if (
      user.blocked &&
      user.blocked.find((blocked_guys) => blocked_guys.id === target)
    )
      throw new UnprocessableEntityException(`You've blocked ${target}`);
    if (
      user2.blocked &&
      user2.blocked.find(
        (blocked_guys) => blocked_guys.id === user.id,
      )
    )
      throw new UnprocessableEntityException(
        `You've been blocked by ${user2.username}`,
      );
    return user2;
  }

  // get a dm by id
  async getDmById(inputed_id: string): Promise<DmEntity> {
    let ret = await this.dmRepository
      .createQueryBuilder('dm')
      .where('dm.id = :id', { id: inputed_id })
      .leftJoin('dm.users', 'users')
      .addSelect('users.id')
      .addSelect('users.username')
      .addSelect('users.profile_picture')
      .getOne();

    return ret;
  }

  /* This function loads the Dm based on name of target*/
  async getDmByTarget(data: DmTargetDto, user: UserEntity): Promise<DmEntity | null> {
    if (user.dms) {
      let convo = user.dms.find(
        (dm) => (dm.users[0].id == data.targetId ||
          dm.users[1].id == data.targetId)
      );
      if (convo) return await this.getDmById(convo.id);
    }
    return null;
  }

  // get all conversations of a user
  async getDmsList(user: UserEntity): Promise<DmEntity[]> {
    if (user.dms.length === 0) return user.dms;
    else {
      return await this.dmRepository
        .createQueryBuilder('dm')
        .leftJoin('dm.users', 'users')
        .addSelect('users.username')
        .addSelect('users.profile_picture')
        .where('dm.id IN (:...ids)', { ids: user.dms.map((elem) => elem.id) })
        .getMany();
    }
  }

  async saveDm(dm: DmEntity) {
    return await this.dmRepository.save(dm);
  }

  /*
	createDM is used to create a new conv between two users, checking if they can, based on their blocked relationship.
	*/
  async createDm(data: DmTargetDto, user: UserEntity): Promise<DmEntity> {
    let user2 = await this.checkifBlocked(user, data.targetId);
    if (user.dms) {
        const convo = user.dms.find(
          (dm) =>
            (dm.users[0].id === user.id &&
              dm.users[1].id === data.targetId) ||
            (dm.users[0].id === data.targetId &&
              dm.users[1].id === user.id),
        );
        if (convo) return await this.getDmById(convo.id);
      }
      
    let new_dm = new DmEntity();

    new_dm.users = [user, user2];
    return await this.saveDm(new_dm);
  }
}
