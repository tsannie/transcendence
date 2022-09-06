import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { TwoFactorService } from '../service/two-factor.service';

@Controller('2fa')
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService
  ) {}

  @Post('generate')
  //@UseGuards(JwtAuthenticationGuard)
  async register() {
    //const { otpauthUrl } = await this.twoFactorService.generateTwoFactorAuthenticationSecret(request.user);

    //return this.twoFactorService.pipeQrCodeStream(response, otpauthUrl);
  }

}
