import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';

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

  async login(user: any) { // TODO replace all any with IUser but with password with null value ??
    const payload = {
      username: user.username,
      sub: user.id    // sub for jwt norm
    };
    console.log('CRASHHH')
    const ret = { access_token: await this.jwtTokenService.sign(payload, { // generate our jwt
        secret:'secret',
        expiresIn: '1h'
      })    // TODO patch this shiit to be in auth.module
    };
    const res = this.jwtTokenService.verify(ret.access_token, {secret:'secret'});
    console.log(res)
    return ret
  }
}
