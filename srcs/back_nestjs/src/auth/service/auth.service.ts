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

  async loginWithCredentials(user: UserDto) {
    const payload = {
      id: user.id,
      name: user.name
    }

    return {
      access_token: this.jwtTokenService.sign(payload)
    };
  }
}
