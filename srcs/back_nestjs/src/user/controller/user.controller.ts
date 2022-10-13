import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';
import { targetNameDto, targetIdDto } from '../dto/target.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { Express } from 'express'
import { AvatarFormatValidator, AvatarFormatValidatorOptions } from '../pipes/filevalidation.validator';

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
  async banUser(@Body() body: targetNameDto, @Request() req) : Promise<UserEntity> {
    return await this.userService.banUser(body.target, req.user);
  }

  @UseGuards( JwtTwoFactorGuard )
  @Post("unBanUser")
  async unBanUser(@Body() body: targetNameDto, @Request() req) : Promise<UserEntity> {
    return await this.userService.unBanUser(body.target, req.user);
  }

  @UseGuards( JwtTwoFactorGuard )
  @Post("addAvatar")
  @UseInterceptors( FileInterceptor('avatar') )
  async addAvatar( @UploadedFile( new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator( { maxSize: 5000000} ),
      new AvatarFormatValidator( {format: ['jpeg', 'png']} ),
    ]
   })) file: Express.Multer.File, @Request() req) : Promise<any>{
    return await this.userService.addAvatar(file, req.user);
  }

  @UseGuards( JwtTwoFactorGuard )
  @Get("avatar")
  async getAvatar(@Query() data : targetIdDto, @Res() res) : Promise<any> {
	res.sendFile(await this.userService.getAvatar(data.id))
  }
}
