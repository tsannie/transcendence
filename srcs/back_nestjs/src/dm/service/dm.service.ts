import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { In, Repository } from 'typeorm';
import { DmNameDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmEntity)
    private dmRepository: Repository<DmEntity>,
    private readonly userService: UserService,
  ) {}

  async checkifBlocked(user: UserEntity, target: string): Promise<UserEntity> {
    let user2 = await this.userService.findUser(target, { blocked: true });

    if (
      user.blocked &&
      user.blocked.find((blocked_guys) => blocked_guys.username === target)
    )
      throw new UnprocessableEntityException(`You've blocked ${target}`);
    if (
      user2.blocked &&
      user2.blocked.find((blocked_guys) => blocked_guys.username === user.username)
    )
      throw new UnprocessableEntityException(
        `You've been blocked by ${user2.username}`,
      );
    return user2;
  }


	// get a dm by id
	async getDmById(inputed_id: number): Promise<DmEntity> {
		let ret = await this.dmRepository
		.createQueryBuilder("dm")
		.where("dm.id = :id", {id: inputed_id})
		.leftJoin("dm.users", "users")
		.addSelect("users.id")
		.addSelect("users.username")
		.getOne();

		return ret;
	}

	/* This function loads the Dm based on name of target*/
	async getDmByTarget(data: DmNameDto, user: UserEntity): Promise<DmEntity> {
		if (user.dms)
		{
			let convo = user.dms.find(
			(dm) =>
				(dm.users[0].username === user.username &&
				dm.users[1].username === data.target) ||
				(dm.users[0].username === data.target &&
				dm.users[1].username === user.username),
			);
			if (convo)
				return await this.getDmById(convo.id);
		}
		else 
			throw new UnprocessableEntityException(`No conversation with ${data.target}`);
	}



	// get all conversations of a user
	async getDmsList( user: UserEntity ): Promise<DmEntity[]> {		
		if (user.dms.length === 0)
			return user.dms;
		else {
			return await this.dmRepository
			.createQueryBuilder("dm")
			.leftJoin("dm.users", "users")
			.addSelect("users.username")
			.where("dm.id IN (:...ids)", {ids: user.dms.map( elem => elem.id)})
			.getMany()
		}
	}

  /*
	createDM is used to create a new conv between two users, checking if they can, based on their blocked relationship.
	*/
	async createDm(data: DmNameDto, user: UserEntity): Promise<DmEntity> {
		let user2 = await this.checkifBlocked(user, data.target);
		if (user.dms)
		{	
			const convo = user.dms.find(
			(dm) =>
				(dm.users[0].username === user.username &&
				dm.users[1].username === data.target) ||
				(dm.users[0].username === data.target &&
				dm.users[1].username === user.username),
			);
			if (convo)
				return await this.getDmById(convo.id);
		}
		let new_dm = new DmEntity();

		new_dm.users = [user, user2];
		return await this.dmRepository.save(new_dm);
	}
}
