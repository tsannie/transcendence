import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';
import { TargetNameDto, TargetIdDto, AvatarDto } from '../dto/target.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateResult } from 'typeorm';
import { NewUsernameDto } from '../models/newusername.dto';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { Express } from 'express'
import { AvatarFormatValidator, AvatarFormatValidatorOptions } from '../pipes/filevalidation.validator';
import { AvatarEntity } from '../models/avatar.entity';

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
  async banUser(@Body() body: TargetNameDto, @Request() req) : Promise<UserEntity> {
    return await this.userService.banUser(body.target, req.user);
  }

  @UseGuards( JwtTwoFactorGuard )
  @Post("unBanUser")
  async unBanUser(@Body() body: TargetNameDto, @Request() req) : Promise<UserEntity> {
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
   })) file: Express.Multer.File, @Request() req) : Promise<AvatarEntity> {
    return await this.userService.addAvatar(file, req.user);
  }

  @UseGuards( JwtTwoFactorGuard )
  @Get("avatar")
  async getAvatar(@Query() data : AvatarDto, @Res() res) : Promise<any> {
	  res.sendFile(await this.userService.getAvatar(data.id, {size: data.size}));
}

  @UseGuards( JwtTwoFactorGuard )
  @Post("deleteAvatar")
  async deleteAvatar(@Request() req) : Promise<AvatarEntity> {
    return await this.userService.deleteAvatar(req.user);
  }
}