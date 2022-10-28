import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOneOptions,
  FindOptionsRelations,
  Repository,
  UpdateResult,
} from 'typeorm';
import { UserEntity } from '../models/user.entity';
import * as sharp from 'sharp';
import * as fs from 'fs';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { IUserSearch } from '../models/iusersearch.interface';

const AVATAR_DEST: string = '/nestjs/datas/users/avatars';

/* 1) If you wanna add a size, you put here a name to that size + a value in number type... */
const SMALL_PIC_SIZE: number = 64;
const MEDIUM_PIC_SIZE: number = 128;
const LARGE_PIC_SIZE: number = 256;
const EXTRA_LARGE_PIC_SIZE: number = 512;

/* 2) ...and then you add it to the map, with a string that will be used through the controller*/
export const AVATAR_SIZES: Map<string, number> = new Map<string, number>();
AVATAR_SIZES.set('small', SMALL_PIC_SIZE);
AVATAR_SIZES.set('medium', MEDIUM_PIC_SIZE);
AVATAR_SIZES.set('large', LARGE_PIC_SIZE);
AVATAR_SIZES.set('extra_large', EXTRA_LARGE_PIC_SIZE);

export interface IAvatarOptions {
  size: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private allUser: Repository<UserEntity>,
    private readonly httpService: HttpService,
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
        blocked: true,
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

  async blockUser(target: string, requester: UserEntity): Promise<UserEntity> {
    if (target === requester.username)
      throw new UnprocessableEntityException(`Cannot ban yourself.`);
    let toBan = await this.findByName(target);
    if (!toBan)
      throw new UnprocessableEntityException(
        `Cannot find a ${target} in database.`,
      );
    else {
      if (!requester.blocked) requester.blocked = [toBan];
      else {
        if (requester.blocked.find((elem) => elem.username === target))
          throw new UnprocessableEntityException(
            `You've already blocked ${target}`,
          );
        else requester.blocked.push(toBan);
      }
    }
    return await this.allUser.save(requester);
  }

  async unBlockUser(
    target: string,
    requester: UserEntity,
  ): Promise<UserEntity> {
    if (target === requester.username)
      throw new UnprocessableEntityException(`Cannot unban yourself.`);
    if (
      !requester.blocked ||
      !requester.blocked.find(
        (blocked_guys) => blocked_guys.username === target,
      )
    )
      throw new UnprocessableEntityException(`${target} is not blocked.`);
    requester.blocked = requester.blocked.filter(
      (blocked_guys) => blocked_guys.username !== target,
    );
    return await this.allUser.save(requester);
  }

  /* This function creates the directory needed to register photos if it doesn't exist */
  createDirectory() {
    if (!fs.existsSync(AVATAR_DEST))
      fs.mkdirSync(AVATAR_DEST, { recursive: true });
  }

  /* This function is responsible of resizing images in a square shape according to the inputed format
	and save it locally in a jpeg format. Eamples : "1_512.jpg" or "12_128.jpg" */
  async resizeImage(size: number, bufferized_img: Buffer, user: UserEntity) {
    this.createDirectory();

    await sharp(bufferized_img)
      .resize(size, size)
      .toFile(`${AVATAR_DEST}/${user.id}_${size}.jpg`)
      .catch((err) => {
        throw new UnprocessableEntityException(
          `Cannot resize avatar for user ${user.username}.`,
        );
      });
  }

  async add42DefaultAvatar(
    url: string,
    user: UserEntity,
  ): Promise<void | UserEntity> {
    let response = await lastValueFrom(
      this.httpService.get(url, { responseType: 'arraybuffer' }),
    );
    return await this.addAvatar(Buffer.from(response.data), user);
  }

  /* This function add avatar after resizing it two times in the form of static .jpg files and
	register the keyname to access these files later in db. Size of those pictures can be changed
	a bit higher in this file (MEDIUM_PIC and SMALL_PIC)*/
  async addAvatar(
    bufferized_img: Buffer,
    user: UserEntity,
  ): Promise<UserEntity> {
    if (user.profile_picture) this.deleteAvatar(user);

    /* This apply the resizing function to all type of size available */
    AVATAR_SIZES.forEach(async (size) => {
      await this.resizeImage(size, bufferized_img, user);
    });

    user.profile_picture = `${process.env.BACK_URL}/user/avatar?id=${user.id}`;
    return await this.allUser.save(user);
  }

  /* This function is querying the DB to find the name of the file then send the wright path according to
	request of user ("medium" or "small") */
  async getAvatar(
    inputed_id: number,
    avatarOptions: IAvatarOptions,
  ): Promise<string> {
    let user = await this.allUser
      .createQueryBuilder('user')
      .select('user.id')
      .where('user.id = :id', { id: inputed_id })
      .getOne();

    if (!user)
      throw new UnprocessableEntityException(
        'Cannot find user corresponding to that id',
      );
    else
      return `${AVATAR_DEST}/${user.id}_${AVATAR_SIZES.get(
        avatarOptions.size,
      )}.jpg`;
  }

  /* This function delete the avatars of the user*/
  deleteAvatar(user: UserEntity) {
    if (user.profile_picture) {
      try {
        /* This function apply a deletion function to every size available on nest server */
        AVATAR_SIZES.forEach((size) => {
          fs.unlinkSync(`${AVATAR_DEST}/${user.id}_${size}.jpg`);
        });
        user.profile_picture = null;
      } catch (err) {
        throw new UnprocessableEntityException(
          `Cannot delete old avatar from server.`,
        );
      }
    }
  }

  /* search user with filter for search bar */
  async searchUser(search: string): Promise<IUserSearch[]> {
    const allUser = await this.allUser.find();

    const filteredSuggestions = allUser.filter((suggestion) => {
      return (
        suggestion.username.toLowerCase().indexOf(search.toLowerCase()) > -1
      );
    });

    return filteredSuggestions.map((suggestion) => {
      return {
        username: suggestion.username,
        picture: suggestion.profile_picture,
      };
    });
  }

  async getFriendList(user: UserEntity): Promise<UserEntity[]> {
    if (!user.friends) return [];
    return user.friends;
  }
}
