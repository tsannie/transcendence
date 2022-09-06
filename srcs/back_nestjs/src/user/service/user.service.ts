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

  async enable2FA(userId: number) {
    return await this.allUser.update(userId, {enabled2FA: true})
  }

  async setSecret2FA(userId: number, secret: string) {
    return await this.allUser.update(userId, {secret2FA: secret})
  }
}
