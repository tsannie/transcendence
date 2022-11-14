import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/service/user.service';
import { IPayload } from '../models/payload.interface';

export const cookieExtractor = function (req: Request) {
  let token: string = null; // TODO type
  if (req && req.cookies) token = req.cookies[process.env.COOKIE_NAME];
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: IPayload) {
    // TODO all check for validate jeton
    //console.log(payload)
    //console.log( await this.userService.findByName(payload.username));
    return await this.userService.findById(payload.sub, {
      // TODO add check for user
      owner_of: true,
      admin_of: true,
      channels: true,
      blocked: true,
      dms: true,
      friends: true,
      friend_requests: true,
    });
  }
}
