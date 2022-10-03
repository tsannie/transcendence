import {
  Injectable, UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/message/models/message.entity';
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
		let user2 = await this.userService.findUser(target, {banned: true});

		if (user.banned && user.banned.find( banned_guys => banned_guys.username === target))
			throw new UnprocessableEntityException(`You've banned ${target}`);
		if (user2.banned && user2.banned.find(banned_guys => banned_guys.username === user.username))
			throw new UnprocessableEntityException(`You've been blocked by ${user2.username}`);
		return user2;	
	}

	
	//code GetDMbyId with offset;

	// get a dm by id
	async getDmById(inputed_id: number): Promise<DmEntity> {
		return await this.dmRepository
		.createQueryBuilder("dm")
		.where("dm.id = :id", {id: inputed_id})
		.leftJoinAndSelect("dm.messages", "messages")
		.orderBy("messages.createdAt", "DESC")
		.select("messages")
		.getOne()
		/* 		return await this.dmRepository.findOne({
			where:{
				id: inputed_id
			},
			relations:{
				messages: true
			},
		}) */
	}
	
	async getDmByName(data: DmDto, user: UserEntity): Promise<DmEntity> {
		let convo = user.dms.find( (dm) => 
				(dm.users[0].username === user.username && dm.users[1].username === data.target) || (dm.users[0].username === data.target && dm.users[1].username === user.username)
		)
		if (!convo)
			throw new UnprocessableEntityException(`No conversation with ${data.target}`);
		else
			return await this.getDmById(convo.id);
	}



	// get all conversations of a user
	async getDmsList(user: UserEntity): Promise<DmEntity[]> {
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
						createdAt: "ASC",
					}
				}
			},

		})
		return reloaded_datas.dms;
	}
	
	/* 
	createDM is used to create a new conv between two users, checking if they can, based on their banned relationship.
	*/
	async createDm(data: DmDto, user: UserEntity): Promise<DmEntity> {
		let user2 = await this.checkifBanned(user, data.target);
		let new_dm = new DmEntity();

		new_dm.users = [user, user2];
		return await this.dmRepository.save(new_dm);
	}
}
