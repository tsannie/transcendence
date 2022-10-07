import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from 'src/user/service/user.service';
import { IPayload } from "../models/payload.interface";

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookie = request?.cookies['AuthToken'];
          return cookie ? cookie.access_token : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: IPayload) {
    const user = await this.userService.findById(payload.sub, {  // TODO add check for user
      owner_of: true,
      admin_of: true,
      channels: true,
      banned: true,
      dms: true
    });
    if (!user.enabled2FA) {
      return user;
    }
    if (payload.isSecondFactor) {
      return user;
    }
  }
}
