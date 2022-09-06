import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class TwoFactorService {
  constructor(
    private readonly userService: UserService,
  ) {}

  public async generateTwoFactorSecret(user: UserDto) {
    const secret = authenticator.generateSecret()

    const otpauthUrl = authenticator.keyuri(
      user.email,
      "transcendence2FA",
      secret
    )

    await this.userService.setSecret2FA(user.id, secret)

    return {
      secret,
      otpauthUrl
    }
  }
}

