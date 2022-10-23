import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { VerifyCallback } from 'passport-jwt';
import { UserService } from 'src/user/service/user.service';
import { AuthService } from '../service/auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.FT_CLIENT_ID,
      clientSecret: process.env.FT_CLIENT_SECRET,
      callbackURL: process.env.FT_CALL_BACK_URL,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile42: any,
  ): Promise<any> {
    return this.authService.validateUser(profile42);
  }
}
