import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';
import { IPayload } from '../models/payload.interface';
import { IToken } from '../models/token.inferface';
import { parse } from 'cookie';
import { FindOptionsRelations } from 'typeorm';
import { WsException } from '@nestjs/websockets';

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

  async getUserWithCookie(
    cookie: string,
    relations_ToLoad: FindOptionsRelations<UserEntity> = undefined,
  ): Promise<UserEntity> {
    const payload: IPayload = await this.jwtTokenService.verify(cookie, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    });

    const user = await this.userService.findByIdSocket(
      payload.sub,
      relations_ToLoad,
    );

    if (!user) return null;

    if (!user.enabled2FA || payload.isSecondFactor) return user;
  }

  async validateSocket(
    socket: Socket,
    relations_ToLoad: FindOptionsRelations<UserEntity> = undefined,
  ): Promise<UserEntity> {
    if (!socket.handshake.headers.cookie) return null;
    const authenticationToken = parse(socket.handshake.headers.cookie)[
      process.env.COOKIE_NAME
    ];
    if (!authenticationToken) return null;
    const user = await this.getUserWithCookie(
      authenticationToken,
      relations_ToLoad,
    );
    if (!user) return null;
    return user;
  }
}
