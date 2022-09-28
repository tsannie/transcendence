import { Body, Controller, Delete, Get, Header, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';
import { targetDto } from '../dto/target.dto';
import { AuthGuard } from '@nestjs/passport';
import { AvatarDto } from '../dto/avatar.dto';

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

  @Get('edit')
  async editUsername() {
    return await this.userService.editUser();
  }

	@UseGuards( AuthGuard('jwt') )
  @Post("banUser")
  async banUser(@Body() body: targetDto, @Request() req) : Promise<UserEntity> {
    return await this.userService.banUser(body.target, req.user);
  }

  @UseGuards( AuthGuard('jwt') )
  @Post("unBanUser")
  async unBanUser(@Body() body: targetDto, @Request() req) : Promise<UserEntity> {
    return await this.userService.unBanUser(body.target, req.user);
  }



  @Post("addAvatar")
  async addAvatar( @Body() data: AvatarDto) : Promise<UserEntity> {
    return await this.userService.addAvatar(data);
  }
}
