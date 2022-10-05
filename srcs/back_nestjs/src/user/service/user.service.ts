import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsRelations, Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';

@Injectable()
export class UserService {
  constructor(
	@InjectRepository(UserEntity)
	private allUser: Repository<UserEntity>,
  ) {}

  async add(user: UserEntity): Promise<UserEntity> {
	return await this.allUser.save(user);
  }

  async findOptions(findOptions: FindOneOptions<UserEntity>) : Promise<UserEntity> {
	return await this.allUser.findOne( findOptions );
  }

  // find user by name
  async findByName( username: string, relations_ToLoad : FindOptionsRelations<UserEntity> = undefined ): Promise<UserEntity> {
	if (!relations_ToLoad)
	{
	  return await this.allUser.findOne({
		where:{
			username: username,
		}
	  });
	}
	else
	{
	  return await this.allUser.findOne({
		where: {
			username: username
		},
		relations: relations_ToLoad
	  });
	}
  }

  //same as findbyName but throw error if not found
  async findUser(username: string, relations_ToLoad : FindOptionsRelations<UserEntity> = undefined) : Promise<UserEntity> {
	let user = await this.findByName(username, relations_ToLoad);
	if (!user)
		throw new UnprocessableEntityException(`User ${user} is not registered in database.`);
	else
		return user;
  }

  // find user by id
  async findById(input_id: number, relations_ToLoad : FindOptionsRelations<UserEntity> = undefined): Promise<UserEntity> {
	if (!relations_ToLoad)
	{
		return await this.allUser.findOne({
			where: {
				id: input_id
			}
		});
	}
	else
	{
		return await this.allUser.findOne({
			where: {
				id: input_id
			},
			relations: relations_ToLoad
		});
	};
  }

  // TODO DELETE
  async getAllUser(): Promise<UserEntity[]> {
	return await this.allUser.find({
		relations : {
			owner_of: true,
			channels: true,
			banned: true,
			admin_of: true,
		}
		}
	)
	};

  async cleanAllUser(): Promise<void> {
	return await this.allUser.clear();
  }


  async editUser(){
	await this.allUser.update(1, {username: "newuser"});
  }

  // turn enabled2FA to true for user
  async enable2FA(userId: number) { // TODO update user ?
	return await this.allUser.update(userId, {enabled2FA: true})
  }

	// turn enabled2FA to false for user TODO delete in front ??
	async disable2FA(userId: number) {
		return await this.allUser.update(userId, { enabled2FA: false });
	}

  async setSecret2FA(userId: number, secret: string) {
	return await this.allUser.update(userId, {secret2FA: secret})
  }

	async banUser(target: string, requester: UserEntity) : Promise<UserEntity>{
		if (target === requester.username)
			throw new UnprocessableEntityException(`Cannot ban yourself.`);
		let toBan = await this.findByName(target);
		if (!toBan)
			throw new UnprocessableEntityException(`Cannot find a ${target} in database.`);
		else
		{
			if (!requester.banned)
				requester.banned = [toBan];
			else
			{
				if (requester.banned.find( elem => elem.username === target))
					throw new UnprocessableEntityException(`You've already banned ${target}`);
				else
					requester.banned.push(toBan);
			}
		}
		return await this.allUser.save(requester);
	}

	async unBanUser(target: string, requester: UserEntity) : Promise<UserEntity> {
		if (target === requester.username)
			throw new UnprocessableEntityException(`Cannot unban yourself.`);
		if (!requester.banned || !requester.banned.find( banned_guys => banned_guys.username === target))
			throw new UnprocessableEntityException(`${target} is not banned.`);
		requester.banned = requester.banned.filter( banned_guys => banned_guys.username !== target );
		return await this.allUser.save(requester);
	}

  async addAvatar(file: any, user: UserEntity) {
    console.log(file);
	return file;
	// user.avatar = data.image;
    // return await this.allUser.save(user);
  }

  async getAvatar(user: UserEntity) {
	//return user.avatar;
  }
}