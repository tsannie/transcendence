import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/service/user.service';
import { IPayload } from '../models/payload.interface';
import { cookieExtractor } from './jwt.strategy';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-2fa',
) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: IPayload) {
    const user = await this.userService.findById(payload.sub, {
      owner_of: true,
      admin_of: true,
      channels: true,
      blocked: true,
      dms: true,
      friends: true,
      friend_requests: true,
      history: true,
    });
    if (!user.enabled2FA) {
      return user;
    }
    if (payload.isSecondFactor) {
      return user;
    }
  }
}
