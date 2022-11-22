import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { parse } from 'cookie';
import { Socket } from 'socket.io';
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
    if (user) return user;

    let new_user = new UserEntity();
    new_user.username = profile42.username.toLowerCase().replace(/ /g, '');
    new_user.email = profile42.emails[0].value;

    /* check if the user is already in the database with the same username
    and if so, add a number to the end of the username */
    while (42) {
      try {
        await this.userService.findByName(new_user.username);
        new_user.username += Math.floor(Math.random() * 10);
      } catch (e) {
        break;
      }
    }

    new_user = await this.register(new_user);

    return await this.userService.add42DefaultAvatar(
      profile42._json.image.link,
      new_user,
    );
  }

  async validateUserGoogle(profile: any): Promise<any> {
    const user = await this.userService.findByMail(profile.emails[0].value);
    if (user) return user;
    if (profile.email_verified !== true) {
      throw new UnauthorizedException('Account not verified');
    }

    let new_user = new UserEntity();
    new_user.username = profile.displayName.toLowerCase().replace(/ /g, '');
    new_user.email = profile.emails[0].value;
    new_user = await this.register(new_user);

    return await this.userService.add42DefaultAvatar(profile.picture, new_user);
  }

  async register(user: UserEntity): Promise<UserEntity> {
    return await this.userService.add(user);
  }

  async getToken(
    user: UserEntity,
    isSecondFactor: boolean = false,
  ): Promise<IToken> {
    const payload: IPayload = {
      sub: user.id, // sub for jwt norm
      isSecondFactor: isSecondFactor,
    };
    const token: IToken = {
      access_token: await this.jwtTokenService.sign(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      }),
    };
    return token;
  }

  async getUserWithCookie(cookie: string): Promise<UserEntity> {
    const payload: IPayload = await this.jwtTokenService.verify(cookie, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });

    const user = await this.userService.findById(payload.sub, {
      owner_of: true,
      admin_of: true,
      channels: true,
      blocked: true,
      dms: true,
    });

    if (!user.enabled2FA || payload.isSecondFactor) return user;
    else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  async validateSocket(socket: Socket): Promise<UserEntity> {
    const authenticationToken = parse(socket.handshake.headers.cookie)[
      process.env.COOKIE_NAME
    ];
    if (!authenticationToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    const user = await this.getUserWithCookie(authenticationToken);
    return user;
  }
}
