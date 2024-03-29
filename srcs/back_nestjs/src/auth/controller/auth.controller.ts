import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Redirect,
  Req,
  SerializeOptions,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserEntity } from 'src/user/models/user.entity';
import FortyTwoGuard from '../guard/fortyTwo.guard';
import GoogleGuard from '../guard/google.guard';
import JwtGuard from '../guard/jwt.guard';
import JwtTwoFactorGuard from '../guard/jwtTwoFactor.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('profile')
  @SerializeOptions({ groups: ['me'] })
  @UseGuards(JwtTwoFactorGuard)
  getProfile(@Req() req: Request): UserEntity {
    return req.user;
  }

  @Get('isTwoFactor')
  @UseGuards(JwtGuard)
  isTwoFactor(@Req() req: Request): { isTwoFactor: boolean } {
    const user = req.user;
    let isTwoFactor = false;
    if (user.enabled2FA) {
      isTwoFactor = true;
    }
    return { isTwoFactor: isTwoFactor };
  }

  @Get('oauth42')
  @SerializeOptions({ groups: ['me'] })
  @UseGuards(FortyTwoGuard)
  @Redirect(process.env.FRONT_URL, 301)
  async oauthFortyTwo(@Req() req: Request): Promise<UserEntity> {
    const user: UserEntity = req.user;
    if (!user) throw new UnauthorizedException('User not found');
    const accessToken = await this.authService.getToken(user);

    req.res.cookie(process.env.COOKIE_NAME, accessToken.access_token, {
      httpOnly: false,
      path: '/',
    });
    return user;
  }

  @Get('oauthGoogle')
  @SerializeOptions({ groups: ['me'] })
  @UseGuards(GoogleGuard)
  @Redirect(process.env.FRONT_URL, 301)
  async oauthGoogle(@Req() req: Request): Promise<UserEntity> {
    const user = req.user;
    if (!user) throw new UnauthorizedException('User not found');
    const accessToken = await this.authService.getToken(user);

    req.res.cookie(process.env.COOKIE_NAME, accessToken.access_token, {
      httpOnly: false,
      path: '/',
    });
    return user;
  }

  @Get('logout')
  @UseGuards(JwtGuard)
  logout(@Req() req: Request): { message: string } {
    req.res.clearCookie(process.env.COOKIE_NAME);
    return { message: 'Logout' };
  }
}
