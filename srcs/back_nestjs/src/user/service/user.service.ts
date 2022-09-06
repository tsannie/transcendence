import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../models/user.entity';
import { IUser } from '../models/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private allUser: Repository<UserEntity>,
  ) {}

  async add(user: UserDto): Promise<UserDto> {
    return await this.allUser.save(user);
  }

  async findByName(username: string): Promise<UserDto> {
    return await this.allUser.findOne({
      username: username,
    });
  }

  // TODO replae all by promise
  getAllUser(): Observable<UserDto[]> {
    return from(this.allUser.find());
  }

  cleanAllUser(): Observable<void> {
    return from(this.allUser.clear());
  }

  // turn enabled2FA to true for user
  async enable2FA(userId: number) {
    return await this.allUser.update(userId, {enabled2FA: true})
  }

  async setSecret2FA(userId: number, secret: string) {
    return await this.allUser.update(userId, {secret2FA: secret})
  }


  // update updatedAt of all users
  async updateAllUser() {
    return await this.allUser.update({}, {updatedAt: new Date()})
  }

  // edit email of all users
  async editAllUserEmail(email: string) {
    this.updateAllUser()
    return await this.allUser.update({}, {email: email})
  }

  // edit username of all users
  async editAllUserUsername(username: string) {
    this.updateAllUser()
    return await this.allUser.update({}, {username: username})
  }

}
