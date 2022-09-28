import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    // TODO check observable or promise ??
    return await this.allUser.findOne({
      where: {
        username: username,
      }
    });
  }

  getAllUser(): Observable<UserDto[]> {
    return from(this.allUser.find());
  }

  cleanAllUser(): Observable<void> {
    return from(this.allUser.clear());
  }
}
