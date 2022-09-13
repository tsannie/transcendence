import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
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

  // find user by name
  async findByName(username: string): Promise<UserEntity> {
    return await this.allUser.findOne({
      username: username,
    });
  }

  // find user by id
  async findById(id: number): Promise<UserEntity> {
    return await this.allUser.findOne(id);
  }

  // TODO DELETE
  async getAllUser(): Promise<UserEntity[]> {
    return await this.allUser.find({
		relations : ["admin_of", "channels"]
		}
	)};

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

  async setSecret2FA(userId: number, secret: string) {
    return await this.allUser.update(userId, {secret2FA: secret})
  }
}
