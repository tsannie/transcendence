import { Body, Controller, Get, Header, Post, Query, Redirect, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/dto/user.dto';
import { IToken } from '../auth.const';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req): Promise<IToken> {
    console.log('new login')
    console.log('user')
    return await this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() user: UserDto): Promise<UserDto> {
    console.log('new register')
    return await this.authService.register(user);
  }

  @Post('/')
  async oauth42(@Query('code') code: string) {
    console.log(code)
    return await this.authService.oauth42(code);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  @Header('Access-Control-Allow-Origin', '*')
  getProfile(@Request() req) {
    console.log('req.user:');
    console.log(req.user);
    console.log('end');
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
  async redirect(@Req() req, @Res({ passthrough: true }) res) {
    const user = req.user;
    const accessToken = await this.authService.login(user);
    res.cookie('AuthToken', accessToken);
    console.log(accessToken)
    return 'bye';
  }
}
