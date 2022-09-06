import { Controller, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { TwoFactorService } from '../service/two-factor.service';

@Controller('2fa')
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('generate')
  async register(@Res() response: Response, @Request() req) {
    const { otpauthUrl } = await this.twoFactorService.generateTwoFactorSecret(req.user)

    console.log(otpauthUrl)

    return this.twoFactorService.generateQrCode(response, otpauthUrl)
  }

}
