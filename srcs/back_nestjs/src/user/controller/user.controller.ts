import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, ParseFilePipe, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';
import { targetDto } from '../dto/target.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { Express } from 'express'
import { AvatarFormatValidator, AvatarFormatValidatorOptions } from '../pipes/filevalidation.pipe';

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
  @UseInterceptors( FileInterceptor('avatar') )
  addAvatar( @UploadedFile( new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator( { maxSize: 5000000} ),
      new AvatarFormatValidator( {format: ['jpeg', 'png']}  ),
    ]
   })) file: Express.Multer.File, @Request() req) : any{
    // console.log(file);
    //return await this.userService.addAvatar(file, req.user);
  }

  //DELETE OR INTEGRATE IN USER GETTER
  @UseGuards( JwtTwoFactorGuard )
  @Get("getAvatar")
  async getAvatar (@Request() req) {//: Promise<string> {
    // return await this.userService.getAvatar(req.user);
  }
}
