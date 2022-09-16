import {
  Controller,
  Get,
  Redirect,
  Req,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import FortyTwoGuard from '../guard/fortyTwo.guard';
import JwtGuard from '../guard/jwt.guard';
import JwtTwoFactorGuard from '../guard/jwtTwoFactor.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(JwtTwoFactorGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtGuard)
  @Get('isTwoFactor')
  async isTwoFactor(@Request() req) {
    const user = req.user;
    let isTwoFactor = false;
    if (user.enabled2FA) {
      isTwoFactor = true;
    }
    return {isTwoFactor: isTwoFactor};
  }

  @UseGuards(FortyTwoGuard)
  @Get('')
  @Redirect('http://localhost:3000/', 301) // TODO env
  async oauthFortyTwo(@Req() req) {
    const user = req.user;
    if (!user)
      throw new UnauthorizedException('User not found');
    const accessToken = await this.authService.getCookie(user);

    req.res.cookie('AuthToken', accessToken, {
      httpOnly: false,
      path: '/',
    });  // TODO 'AuthToken' const env
    return user;
  }
}
