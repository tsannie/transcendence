import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/service/user.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';

@Injectable()
export class TwoFactorService {
  constructor(
    private readonly userService: UserService,
  ) {}

  async generateTwoFactorSecret(user: UserDto) {
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

  async generateQrCode(stream: Response, otpauthUrl: string) {
    return await toFileStream(stream, otpauthUrl);
  }

  async codeIsValid(token: string, user: UserDto): Promise<boolean> {
    return await authenticator.verify({
      token: token,
      secret: user.secret2FA
    })
  }
}

