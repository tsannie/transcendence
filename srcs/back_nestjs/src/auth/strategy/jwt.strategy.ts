import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/service/user.service';
import { IPayload } from '../models/payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        //TODO add baerer ?
        (request: Request) => {
          console.log('hello');
          const cookie = request?.cookies['AuthToken'];
          console.log('cookie', cookie);
          return cookie ? cookie.access_token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    // TODO all check for validate jeton
    //console.log(payload)
    //console.log( await this.userService.findByName(payload.username));
    return await this.userService.findByName(payload.username, {
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
