import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Request,
  Res,
  SerializeOptions,
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
import { NewUsernameDto } from '../dto/newusername.dto';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { Express } from 'express';
import { AvatarFormatValidator } from '../pipes/filevalidation.validator';
import { UserSearchDto } from '../dto/usersearch.dto';
import { IUserSearch } from '../models/iusersearch.interface';
import { ChannelEntity } from 'src/channel/models/channel.entity';
import { DmEntity } from 'src/dm/models/dm.entity';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  // edit username
  @Post('edit-username')
  @SerializeOptions({ groups: ['me'] })
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

  @Get('username')
  @SerializeOptions({ groups: ['user'] })
  async getUserByUsername(@Query() body: TargetNameDto): Promise<UserEntity> {
    return await this.userService.findByName(body.username, { friends: true });
  }

  @Get('id')
  @SerializeOptions({ groups: ['user'] })
  async getUserById(@Query() body: TargetIdDto): Promise<UserEntity> {
    return await this.userService.findById(body.id, { friends: true });
  }

  @Get()
  @SerializeOptions({ groups: ['user'] })
  async getAllUser(): Promise<UserEntity[]> {
    return await this.userService.getAllUser();
  }

  @Get('search')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async searchUser(@Query() body: UserSearchDto): Promise<IUserSearch[]> {
    return await this.userService.searchUser(body.search);
  }

  @Post('blockUser') // TODO to lower cases everywhere
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async blockUser(
    @Body() body: TargetNameDto,
    @Request() req,
  ): Promise<UserEntity> {
    return await this.userService.blockUser(body.username, req.user);
  }

  @Post('unBlockUser')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async unBlockUser(
    @Body() body: TargetNameDto,
    @Request() req,
  ): Promise<UserEntity> {
    return await this.userService.unBlockUser(body.username, req.user);
  }

  @Post('addAvatar')
  @SerializeOptions({ groups: ['user'] })
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

  @Get('conversations')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getConvos(@Request() req): Promise<(ChannelEntity | DmEntity)[]> {
    return this.userService.getConversations(req.user);
  }

  @Get('friendlist')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async friendList(@Request() req): Promise<UserEntity[]> {
    return await this.userService.getFriendList(req.user);
  }

  @Post('accept-friend-request')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async acceptFriendRequest(@Request() req, @Body() target: TargetIdDto) {
    const userTarget = await this.userService.findById(target.id, {
      friend_requests: true,
      friends: true,
    });
    return await this.userService.acceptFriendRequest(req.user, userTarget);
  }

  @Post('refuse-friend-request')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async refuseFriendRequest(
    @Request() req,
    @Body() target: TargetIdDto,
  ): Promise<UserEntity> {
    const userTarget = await this.userService.findById(target.id, {
      friend_requests: true,
    });
    return await this.userService.refuseFriendRequest(req.user, userTarget);
  }

  @Post('create-friend-request')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async createFriendRequest(
    @Request() req,
    @Body() target: TargetIdDto,
  ): Promise<UserEntity> {
    const userTarget = await this.userService.findById(target.id, {
      friend_requests: true,
    });
    await this.userService.createFriendRequest(req.user, userTarget);
    return userTarget;
  }

  @Get('friend-request')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getFriendRequest(@Request() req): Promise<UserEntity[]> {
    return await this.userService.getFriendRequest(req.user);
  }

  @Post('remove-friend')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async removeFriend(
    @Request() req,
    @Body() target: TargetIdDto,
  ): Promise<UserEntity[]> {
    const userTarget = await this.userService.findById(target.id, {
      friends: true,
    });
    return await this.userService.removeFriend(req.user, userTarget);
  }
}
