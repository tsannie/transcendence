import { Body, Controller, Get, Header, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/service/user.service';
import { AuthService, IToken } from '../service/auth.service';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req): Promise<IToken> {
    console.log('hello')
    return await this.authService.login(req.user);
  }

  @Post()
  @Header('Access-Control-Allow-Origin', '*')
  async add(@Body() user: UserDto): Promise<UserDto> {
    return await this.authService.register(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req)
    return req.user;
  }
}
