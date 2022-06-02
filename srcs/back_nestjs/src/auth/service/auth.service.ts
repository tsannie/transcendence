import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class AuthService {
  constructor (
    private userService: UserService,
    private jwtTokenService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByName(username)
    if (user && user.password === password) // TODO check password with hash ???
    {
      const { password, ...result } = user;
      return result; // return user object without password
    }
    return null;
  }

  async login(user: UserDto) {
    const payload = {
      username: user.username,
      id: user.id
    }
    return {
      access_token: this.jwtTokenService.sign(payload)  // generate our jwt
    };
  }
}
