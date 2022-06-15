import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/service/user.service';
import { apiOAuth42, data_req, IToken, URL_API42 } from '../auth.const';

@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtTokenService: JwtService
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

  async register(user: UserDto): Promise<UserDto> {
    return await this.userService.add(user);
  }

  async oauth42(code: string): Promise<any>  {
    const res = await apiOAuth42.post(URL_API42, {...data_req, code})
    .catch(() => {
        throw new UnauthorizedException();  // connexion failed
    }).then((res: any) => {
      return res.data;
    });
    return res;
  }


  async login(user: any): Promise<IToken> {
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
