import { Body, Controller, Delete, Get, Header, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';
import { targetDto } from '../dto/target.dto';
import { AuthGuard } from '@nestjs/passport';
import { AvatarDto } from '../dto/avatar.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateResult } from 'typeorm';
import { NewUsernameDto } from '../models/newusername.dto';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';

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

	@UseGuards( JwtTwoFactorGuard )
  @Post("banUser")
  async banUser(@Body() body: targetDto, @Request() req) : Promise<UserEntity> {
    return await this.userService.banUser(body.target, req.user);
  }

  @UseGuards( JwtTwoFactorGuard )
  @Post("unBanUser")
  async unBanUser(@Body() body: targetDto, @Request() req) : Promise<UserEntity> {
    return await this.userService.unBanUser(body.target, req.user);
  }

  @UseGuards( JwtTwoFactorGuard )
  @Post("addAvatar")
  @UseInterceptors(FileInterceptor('image'))
  async addAvatar( @UploadedFile() file: any, @Request() req) : Promise<void|UserEntity> {
    return await this.userService.addAvatar(file, req.user);
  }

  //DELETE OR INTEGRATE IN USER GETTER
  @UseGuards( JwtTwoFactorGuard )
  @Get("getAvatar")
  async getAvatar (@Request() req) {//: Promise<string> {
    // return await this.userService.getAvatar(req.user);
  }
}
