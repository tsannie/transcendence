import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Req,
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
import { Express, Request, Response } from 'express';
import { AvatarFormatValidator } from '../pipes/filevalidation.validator';
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
    @Req() req: Request,
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
    return await this.userService.findByName(body.username, {
      friends: true,
      blocked: true,
    });
  }

  @Get('id')
  @SerializeOptions({ groups: ['user'] })
  async getUserById(@Query() body: TargetIdDto): Promise<UserEntity> {
    return await this.userService.findById(body.id, {
      friends: true,
    });
  }

  @Get('search')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async searchUser(@Query() body: TargetNameDto): Promise<IUserSearch[]> {
    return await this.userService.searchUser(body.username);
  }

  @Post('block')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async blockUser(
    @Body() body: TargetNameDto,
    @Req() req: Request,
  ): Promise<UserEntity> {
    return await this.userService.blockUser(body.username, req.user);
  }

  @Post('unBlock')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async unBlockUser(
    @Body() body: TargetNameDto,
    @Req() req: Request,
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
    @Req() req: Request,
  ): Promise<UserEntity> {
    return await this.userService.addAvatar(file.buffer, req.user);
  }

  @Get('avatar')
  @UseGuards(JwtTwoFactorGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAvatar(
    @Query() data: AvatarDto,
    @Res() res: Response,
  ): Promise<void> {
    res.sendFile(
      await this.userService.getAvatar(data.id, { size: data.size }),
    );
  }

  @Get('conversations')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getConvos(@Req() req: Request): Promise<(ChannelEntity | DmEntity)[]> {
    return this.userService.getConversations(req.user);
  }

  @Post('accept-friend-request')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async acceptFriendRequest(@Req() req: Request, @Body() target: TargetIdDto) {
    const userTarget = await this.userService.findById(target.id, {
      friend_requests: true,
      friends: true,
    });
    await this.userService.acceptFriendRequest(req.user, userTarget);
  }

  @Post('refuse-friend-request')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async refuseFriendRequest(
    @Req() req: Request,
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
    @Req() req: Request,
    @Body() target: TargetIdDto,
  ): Promise<UserEntity[]> {
    const userTarget = await this.userService.findById(target.id, {
      friend_requests: true,
      blocked: true,
    });

    if (
      req.user.friend_requests &&
      req.user.friend_requests.find((elem) => elem.id === target.id)
    ) {
      return await this.userService.acceptFriendRequest(req.user, userTarget);
    } else {
      return await this.userService.createFriendRequest(req.user, userTarget);
    }
  }

  @Get('friend-request')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async getFriendRequest(@Req() req: Request): Promise<UserEntity[]> {
    return await this.userService.getFriendRequest(req.user);
  }

  @Post('remove-friend')
  @SerializeOptions({ groups: ['user'] })
  @UseGuards(JwtTwoFactorGuard)
  async removeFriend(
    @Req() req: Request,
    @Body() target: TargetIdDto,
  ): Promise<UserEntity[]> {
    const userTarget = await this.userService.findById(target.id, {
      friends: true,
    });
    return await this.userService.removeFriend(req.user, userTarget);
  }

  @Get('leaderboard')
  @UseGuards(JwtTwoFactorGuard)
  async getLeaderboard(
    @Req() req: Request,
    @Query() userTarget: TargetIdDto,
  ): Promise<number> {
    const allUsers = await this.userService.getAllUsersWithElo();

    return this.userService.getLeaderBoard(userTarget.id, allUsers);
  }
}
