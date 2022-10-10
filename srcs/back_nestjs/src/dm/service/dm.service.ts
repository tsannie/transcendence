import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { DmNameDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmEntity)
    private dmRepository: Repository<DmEntity>,
    private readonly userService: UserService,
  ) {}

  async checkifBanned(user: UserEntity, target: string): Promise<UserEntity> {
    let user2 = await this.userService.findUser(target, { banned: true });

    if (
      user.banned &&
      user.banned.find((banned_guys) => banned_guys.username === target)
    )
      throw new UnprocessableEntityException(`You've banned ${target}`);
    if (
      user2.banned &&
      user2.banned.find((banned_guys) => banned_guys.username === user.username)
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
		return await this.dmRepository
		.createQueryBuilder("dm")
		.leftJoin("dm.users", "users")
		.addSelect("users.id")
		.where('dm.users.id = :id', {id: user.id})
		.getMany();




		let reloaded_datas = await this.userService.findOptions({
			where: {
				username: user.username
			},
			relations: {
				dms:{
					users: true,
					messages: {
						author: true,
					},
				}
			},
			select: {
				dms: {
					id: true,
					users: {
						id: true,
						username: true,
					},
					messages: {
						createdAt : true,
						author: {
							username: true
						},
						content: true,
					}
				}
			},
			order: {
				dms:{
					messages: {
						createdAt: "DESC",
					}
				}
			},

		})
		return reloaded_datas.dms;
	}

  /*
	createDM is used to create a new conv between two users, checking if they can, based on their banned relationship.
	*/
	async createDm(data: DmNameDto, user: UserEntity): Promise<DmEntity> {
		let user2 = await this.checkifBanned(user, data.target);
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
