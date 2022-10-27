import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { UserEntity } from '../models/user.entity';
import { TargetNameDto, TargetIdDto, AvatarDto } from '../dto/target.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateResult } from 'typeorm';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { Express } from 'express';
import {
  AvatarFormatValidator,
  AvatarFormatValidatorOptions,
} from '../pipes/filevalidation.validator';
import { UserSearchDto } from '../dto/usersearch.dto';
import { IUserSearch } from '../models/iusersearch.interface';
import { NewUsernameDto } from '../models/newusername.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // edit username
  @Post('edit-username')
  @UseGuards(JwtTwoFactorGuard)
  async editUsername(
    @Request() req,
    @Body() newUsername: NewUsernameDto,
  ): Promise<UpdateResult> {
    return await this.userService.editUsername(
      req.user.id,
      newUsername.username,
    );
  }

  @Get()
  async getAllUser(): Promise<UserEntity[]> {
    return await this.userService.getAllUser();
  }

  @Get('search')
  async searchUser(@Body() body: UserSearchDto): Promise<IUserSearch[]> {
    return await this.userService.searchUser(body.search);
  }

  @Delete()
  async cleanAllUser(): Promise<void> {
    return await this.userService.cleanAllUser();
  }

  @Post('blockUser')
  @UseGuards(JwtTwoFactorGuard)
  async blockUser(
    @Body() body: TargetNameDto,
    @Request() req,
  ): Promise<UserEntity> {
    return await this.userService.blockUser(body.target, req.user);
  }

  @Post('unBlockUser')
  @UseGuards(JwtTwoFactorGuard)
  async unBlockUser(
    @Body() body: TargetNameDto,
    @Request() req,
  ): Promise<UserEntity> {
    return await this.userService.unBlockUser(body.target, req.user);
  }

  @Post('addAvatar')
  @UseGuards(JwtTwoFactorGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async addAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new AvatarFormatValidator({ format: ['jpg', 'jpeg', 'png'] }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Request() req,
  ): Promise<UserEntity> {
    return await this.userService.addAvatar(file.buffer, req.user);
  }

  @Get('avatar')
  @UseGuards(JwtTwoFactorGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAvatar(@Query() data: AvatarDto, @Res() res): Promise<void> {
    res.sendFile(
      await this.userService.getAvatar(data.id, { size: data.size }),
    );
  }

  @Post('deleteAvatar')
  @UseGuards(JwtTwoFactorGuard)
  deleteAvatar(@Request() req) {
    return this.userService.deleteAvatar(req.user);
  }
}
