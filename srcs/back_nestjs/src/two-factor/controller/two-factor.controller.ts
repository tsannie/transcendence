import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { AuthService } from 'src/auth/service/auth.service';
import { logger2FA } from '../const/const';
import { TokenDto } from '../dto/token.dto';
import { TwoFactorService } from '../service/two-factor.service';
import JwtGuard from 'src/auth/guard/jwt.guard';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';
import { UserEntity } from 'src/user/models/user.entity';
import { UpdateResult } from 'typeorm';
import { Request, Response } from 'express';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('auth2fa')
  @SerializeOptions({ groups: ['me'] })
  @UseGuards(JwtGuard)
  async auth2fa(
    @Body() tokenBody: TokenDto,
    @Req() req: Request,
  ): Promise<UserEntity> {
    const validToken = await this.twoFactorService.codeIsValid(
      tokenBody.token,
      req.user,
    );
    if (!validToken) {
      throw new UnauthorizedException(
        'Authentication failed - invalid token !',
      );
    }
    const accessToken = await this.authService.getToken(req.user, true);
    req.res.cookie(process.env.COOKIE_NAME, accessToken.access_token, {
      httpOnly: false,
      path: '/',
    });
    return req.user;
  }

  // generate a new qrcode for the user
  @Get('generate')
  @UseGuards(JwtTwoFactorGuard)
  async generate(@Res() response: Response, @Req() req: Request): Promise<any> {
    const { otpauthUrl } = await this.twoFactorService.generateTwoFactorSecret(
      req.user,
    );

    return this.twoFactorService.generateQrCode(response, otpauthUrl);
  }

  // verify the token and enable 2FA for the user
  @Post('check-token')
  @SerializeOptions({ groups: ['me'] })
  @UseGuards(JwtTwoFactorGuard)
  async verifyToken(
    @Body() tokenBody: TokenDto,
    @Req() req: Request,
  ): Promise<UpdateResult> {
    const valid = await this.twoFactorService.codeIsValid(
      tokenBody.token,
      req.user,
    );

    if (valid) {
      logger2FA.log(`2FA enabled for user ${req.user.username}`);
      return await this.userService.enable2FA(req.user.id);
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // disable 2FA for the user
  @Post('disable')
  @SerializeOptions({ groups: ['me'] })
  @UseGuards(JwtTwoFactorGuard)
  async disable(@Req() req: Request): Promise<UpdateResult> {
    logger2FA.log(`2FA disabled for user ${req.user.username}`);
    return await this.userService.disable2FA(req.user.id);
  }
}
