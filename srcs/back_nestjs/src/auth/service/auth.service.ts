import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/service/user.service';

export interface IToken {
  access_token: string;
}

@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtTokenService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByName(username);
    if (user && user.password === password) // TODO check password with hash ???
    {
      const { password, ...result } = user;  // user object without password
      return result;
    }
    return null;
  }

  async register(user: UserDto): Promise<UserDto> {
    return await this.userService.add(user);
  }


  async login(user: any): Promise<IToken> { // TODO replace all any with IUser but with password with null value ??
    const payload = {
      username: user.username,
      sub: user.id    // sub for jwt norm
    };
    const token = { access_token: await this.jwtTokenService.sign(payload, { // generate our jwt
        secret:'secret',
        expiresIn: '1h'
      })    // TODO patch this shiit to be in auth.module
    };
    const res = await this.jwtTokenService.verify(token.access_token, {secret:'secret'});
    //console.log(res)
    return token;
  }
}
