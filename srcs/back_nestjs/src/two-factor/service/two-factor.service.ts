import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user.service';

@Injectable()
export class TwoFactorService {
  constructor(private readonly userService: UserService) {}

  async generateTwoFactorSecret(user: UserEntity) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      'transcendence2FA',
      secret,
    );

    await this.userService.setSecret2FA(user.id, secret);

    return {
      secret,
      otpauthUrl,
    };
  }

  async generateQrCode(stream: Response, otpauthUrl: string) {
    return await toFileStream(stream, otpauthUrl);
  }

  async codeIsValid(token: string, user: UserEntity): Promise<boolean> {
    return await authenticator.verify({
      token: token,
      secret: user.secret2FA,
    });
  }
}
