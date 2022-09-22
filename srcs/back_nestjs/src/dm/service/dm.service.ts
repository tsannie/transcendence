import {
  Injectable, UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains } from 'class-validator';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { Repository } from 'typeorm';
import { DmDto } from '../dto/dm.dto';
import { DmEntity } from '../models/dm.entity';

@Injectable()
export class DmService {
	constructor(
	@InjectRepository(DmEntity)
	private dmRepository: Repository<DmEntity>,

	private readonly userService: UserService,
	) {}

	async checkifBanned(user: UserEntity, target: string) : Promise<UserEntity> {
		let user2 = await this.userService.findUser(target, ["banned"]);

		if (user.banned && user.banned.find( banned_guys => banned_guys.username === target))
			throw new UnprocessableEntityException(`You've banned ${target}`);
		if (user2.banned && user2.banned.find(banned_guys => banned_guys.username === user.username))
			throw new UnprocessableEntityException(`You've been blocked by ${user2.username}`);
		return user2;	
	}

	
	// get a dm by id
	async getDmById(id: number): Promise<void | DmEntity> {
		
	}
	
	async getDmByName(data: DmDto, user: UserEntity): Promise<DmEntity> {
		let user2 = await this.userService.findUser(data.target);
		let sorted = [user, user2].sort( (user, user2) => {
			if (user.username < user2.username)
				return -1;
			else
				return 1;
		});
		console.log(sorted);
		return await this.dmRepository.findOne({
			where: {
				users: ArrayContains([user, user2]),
			}
		});
	}

	// get all conversations of a user
	async getAllDms(user: UserEntity): Promise<void | DmEntity[]> {
		return user.dms;
	}
	
	/* 
	createDM is used to create a new conv between two users, checking if they can, based on their banned relationship.
	*/
	async createDm(data: DmDto, user: UserEntity): Promise<DmEntity> {
		let user2 = await this.checkifBanned(user, data.target);
		let new_dm = new DmEntity();

		new_dm.users = [user, user2].sort( (user, user2) => (user.username < user2.username)? -1 : 1)
		console.log(new_dm.users);

		let result = await this.dmRepository.save(new_dm);
		console.log("kikoo")
		return result;
	}
}
