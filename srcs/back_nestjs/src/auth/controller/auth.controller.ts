import {
  Controller,
  Get,
  Redirect,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import FortyTwoGuard from '../guard/fortyTwo.guard';
import JwtTwoFactorGuard from '../guard/jwtTwoFactor.guard';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(AuthGuard('jwt-2fa'))
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(FortyTwoGuard)
  @Get('/')
  async nothing() {
    return 'hello';
  }

  @UseGuards(FortyTwoGuard)
  @Get('/redirect')
  @Redirect('http://localhost:3000/', 301) // TODO env
  async redirect(@Req() req) {
    const user = req.user;
    const accessToken = await this.authService.getCookie(user);
    //req.res.setHeader('Set-Cookie','AuthToken=' + accessToken.access_token + '; Path=/;'); // TODO AuthToken const env

    req.res.cookie('AuthToken', accessToken, {
      httpOnly: false,
      path: '/',
    });  // TODO 'AuthToken' const env
    return 'bye';
  }
}
