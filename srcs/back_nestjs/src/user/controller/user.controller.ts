import { Body, Controller, Delete, Get, Header, Post, Request, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { UpdateResult } from 'typeorm';
import { NewUsernameDto } from '../models/newusername.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // edit username
  @Post('edit-username')
  @UseGuards(JwtTwoFactorGuard)
  async editUsername(@Request() req, @Body() newUsername: NewUsernameDto): Promise<UpdateResult> {
    return await this.userService.editUsername(req.user.id, newUsername.username);
  }

  @Get()
  async getAllUser(): Promise<UserEntity[]> {
    return await this.userService.getAllUser();
  }

  @Delete()
  async cleanAllUser(): Promise<void> {
    return await this.userService.cleanAllUser();
  }
}
