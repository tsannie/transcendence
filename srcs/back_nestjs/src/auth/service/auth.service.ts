import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { IPayload } from '../models/payload.interface';
import { IToken } from '../models/token.inferface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async validateUser(profile42: any): Promise<any> {
    const user = await this.userService.findByMail(profile42.emails[0].value);
    if (user)
      return user;

    let new_user = new UserEntity();
    new_user.username = profile42.username;
    new_user.email = profile42.emails[0].value;
    new_user = await this.register(new_user);

    return await this.userService.add42DefaultAvatar(profile42._json.image_url, new_user);
  }

  async register(user: UserEntity): Promise<UserEntity> {
    return await this.userService.add(user);
  }

  async getCookie(user: any, isSecondFactor = false): Promise<IToken> { // TODO replace by the entity ??
    const payload: IPayload = {
      sub: user.id, // sub for jwt norm
      isSecondFactor: isSecondFactor,
    };
    //console.log('payload', payload)
    const token: IToken = { access_token: await this.jwtTokenService.sign(payload, { // generate our jwt
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
      })
    };
    return token;
  }
}
