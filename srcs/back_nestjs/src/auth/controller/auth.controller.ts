import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Redirect,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/models/user.entity';
import { IToken } from '../models/token.inferface';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(AuthGuard('local'))    // TODO replace with const for all guard
  @Post('/login')
  async login(@Request() req): Promise<IToken> {
    console.log('new login');
    //console.log('user');
    return await this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getProfile(@Request() req) {
    const user = req.user;
    return req.user;
  }

  @UseGuards(AuthGuard('42'))
  @Get('/')
  async nothing() {
    return 'hello';
  }

  @UseGuards(AuthGuard('42'))
  @Get('/redirect')
  @Redirect('http://localhost:3000/', 301) // TODO env
  async redirect(@Req() req) {
    const user = req.user;
    const accessToken = await this.authService.login(user);
    //req.res.setHeader('Set-Cookie','AuthToken=' + accessToken.access_token + '; Path=/;'); // TODO AuthToken const env

    req.res.cookie('AuthToken', accessToken, {
      httpOnly: false,
      path: '/',
    });  // TODO 'AuthToken' const env
    return 'bye';
  }
}
