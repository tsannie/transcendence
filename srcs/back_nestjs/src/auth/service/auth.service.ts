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
    const user = await this.userService.findByName(profile42.username);
    if (user)
      return user;
    return this.register({
      username: profile42.username,
      email: profile42.emails[0].value,
    });
  }

  async register(user: UserEntity): Promise<UserEntity> {
    return await this.userService.add(user);
  }

  async getCookie(user: any, isSecondFactor = false): Promise<IToken> { // TODO replace by the entity ??
    const payload: IPayload = {
      username: user.username,
      sub: user.id, // sub for jwt norm
      isSecondFactor: isSecondFactor,
    };
    //console.log('payload', payload)
    const token: IToken = { access_token: await this.jwtTokenService.sign(payload, { // generate our jwt
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,    // TODO const
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME     // TODO const with time of cookie
      })
    };
    return token;
  }
}
