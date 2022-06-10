import { Body, Controller, Get, Header, Post, Query, Request, UseGuards } from '@nestjs/common';
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
    return await this.authService.login(req.user);
  }

  @Post('/register')
  @Header('Access-Control-Allow-Origin', '*')
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
  @Get('profile')
  getProfile(@Request() req) {
    //console.log(req)
    return req.user;
  }
}