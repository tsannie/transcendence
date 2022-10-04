import { Body, Controller, Delete, Get, Header, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUser():  Promise<UserEntity[]> {
    return await this.userService.getAllUser();
  }

  @Delete()
  async cleanAllUser(): Promise<void> {
    return await this.userService.cleanAllUser();
  }
}
