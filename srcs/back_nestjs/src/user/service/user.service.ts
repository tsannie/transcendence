import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarEntity } from '../models/avatar.entity';
import {
  FindOneOptions,
  FindOptionsRelations,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserEntity } from '../models/user.entity';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { resolve } from 'path';

export const AVATAR_DEST: string = "/nestjs/datas/users/avatars";
export const AVATAR_SIZE: string[] = ["medium", "small"];
export const MEDIUM_PIC: number = 512;
export const SMALL_PIC: number = 128;

export interface IAvatarOptions {
	  size: string;
}


@Injectable()
export class UserService {
  constructor(
	@InjectRepository(UserEntity)
	private allUser: Repository<UserEntity>,

	@InjectRepository(AvatarEntity)
	private avatarRepository: Repository<AvatarEntity>,
  ) {}

  async add(user: UserEntity): Promise<UserEntity> {
    return await this.allUser.save(user);
  }

  async findOptions(
    findOptions: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    return await this.allUser.findOne(findOptions);
  }

  // find user by name
  async findByName(
    username: string,
    relations_ToLoad: FindOptionsRelations<UserEntity> = undefined,
  ): Promise<UserEntity> {
    if (!relations_ToLoad) {
      return await this.allUser.findOne({
        where: {
          username: username,
        },
      });
    } else {
      return await this.allUser.findOne({
        where: {
          username: username,
        },
        relations: relations_ToLoad,
      });
    }
  }

  //same as findbyName but throw error if not found
  async findUser(
    username: string,
    relations_ToLoad: FindOptionsRelations<UserEntity> = undefined,
  ): Promise<UserEntity> {
    let user = await this.findByName(username, relations_ToLoad);
    if (!user)
      throw new UnprocessableEntityException(
        `User ${user} is not registered in database.`,
      );
    else return user;
  }

  // find user by mail
  async findByMail(email: string): Promise<UserEntity> {
    return await this.allUser.findOne({
      where: {
        email: email,
      },
    });
  }

  // edit username for user
  async editUsername(
    userId: number,
    newUsername: string,
  ): Promise<UpdateResult> {
    return await this.allUser.update(userId, { username: newUsername });
  }

  // find user by id
  async findById(
    input_id: number,
    relations_ToLoad: FindOptionsRelations<UserEntity> = undefined,
  ): Promise<UserEntity> {
    if (!relations_ToLoad) {
      return await this.allUser.findOne({
        where: {
          id: input_id,
        },
      });
    } else {
      return await this.allUser.findOne({
        where: {
          id: input_id,
        },
        relations: relations_ToLoad,
      });
    }
  }

  // TODO DELETE
  async getAllUser(): Promise<UserEntity[]> {
    return await this.allUser.find({
      relations: {
        owner_of: true,
        channels: true,
        banned: true,
        admin_of: true,
      },
    });
  }

  async cleanAllUser(): Promise<void> {
    return await this.allUser.clear();
  }

  async editUser() {
    await this.allUser.update(1, { username: 'newuser' });
  }

  // turn enabled2FA to true for user
  async enable2FA(userId: number) {
    // TODO update user ?
    return await this.allUser.update(userId, { enabled2FA: true });
  }

  // turn enabled2FA to false for user TODO delete in front ??
  async disable2FA(userId: number) {
    return await this.allUser.update(userId, { enabled2FA: false });
  }

  async setSecret2FA(userId: number, secret: string) {
    return await this.allUser.update(userId, { secret2FA: secret });
  }

  async banUser(target: string, requester: UserEntity): Promise<UserEntity> {
    if (target === requester.username)
      throw new UnprocessableEntityException(`Cannot ban yourself.`);
    let toBan = await this.findByName(target);
    if (!toBan)
      throw new UnprocessableEntityException(
        `Cannot find a ${target} in database.`,
      );
    else {
      if (!requester.banned) requester.banned = [toBan];
      else {
        if (requester.banned.find((elem) => elem.username === target))
          throw new UnprocessableEntityException(
            `You've already banned ${target}`,
          );
        else requester.banned.push(toBan);
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
	
	/* This function is responsible of resizing images in a square shape according to the inputed format
	and save it locally in a jpeg format. Eamples : "1_512.jpg" or "12_128.jpg" */
	async resizeImage(size: number, file: Express.Multer.File, user: UserEntity){
		await sharp(file.buffer)
		.resize(size, size)
		.toFile(`${AVATAR_DEST}/${user.id}_${size}.jpg`)
		.catch( err =>
				{
					throw new UnprocessableEntityException(`Cannot resize avatar for user ${user.username}.`)
				}
			);
	}

	/* This function add avatar after resizing it two times in the form of static .jpg files and 
	register the keyname to access these files later in db. Size of those pictures can be changed
	a bit higher in this file (MEDIUM_PIC and SMALL_PIC)*/
	async addAvatar(file: Express.Multer.File, user: UserEntity) : Promise<AvatarEntity> {
		if (user.avatar)
			await this.deleteAvatar(user);

		await this.resizeImage( MEDIUM_PIC, file, user);
		await this.resizeImage( SMALL_PIC, file, user);
		
		let avatar = new AvatarEntity();
		avatar.filename = `${user.id}`;
		avatar.user = user;
		return await this.avatarRepository.save(avatar);
	}

	/* This function is querying the DB to find the name of the file then send the wright path according to
	request of user ("medium" or "small") */
	async getAvatar(inputed_id: number, avatarOptions: IAvatarOptions) : Promise<string> {
		let avatar = await this.avatarRepository
		.createQueryBuilder("avatar")
		.leftJoin("avatar.user", "user")
		.addSelect("user.id")
		.where("user.id = :id", { id: inputed_id })
		.getOne()

		if (!avatar)
			throw new UnprocessableEntityException("Cannot find any avatar corresponding to that id");

		if (avatarOptions.size === "medium")
			return `${AVATAR_DEST}/${avatar.filename}_${MEDIUM_PIC}.jpg`;
		else if (avatarOptions.size === "small")
			return `${AVATAR_DEST}/${avatar.filename}_${SMALL_PIC}.jpg`;
		}

	/* This function delete the avatars of the user*/
	async deleteAvatar(user: UserEntity) : Promise<AvatarEntity> {
		if (user.avatar)
		{
			let avatar = user.avatar;
			user.avatar = null;
			try
			{
				fs.unlinkSync(`${AVATAR_DEST}/${avatar.filename}_${MEDIUM_PIC}.jpg`);
				fs.unlinkSync(`${AVATAR_DEST}/${avatar.filename}_${SMALL_PIC}.jpg`);
			}
			catch (err)
			{
				throw new UnprocessableEntityException(`Cannot delete old avatar from server.`);
			}
			return await this.avatarRepository.remove(avatar);
		}
	}
}
