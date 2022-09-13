import { Body, Controller, Get, Logger, Post, Req, Request, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserService } from 'src/user/service/user.service';
import { AuthService } from 'src/auth/service/auth.service';
import { logger2FA } from '../const/const';
import { TokenDto } from '../dto/token.dto';
import { TwoFactorService } from '../service/two-factor.service';

@Controller('2fa')
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('auth2fa')
  @UseGuards(AuthGuard('jwt'))
  async auth2fa(@Body() tokenBody: TokenDto, @Request() req) {
    const validToken =  await this.twoFactorService.codeIsValid(tokenBody.token, req.user);
    if (!validToken) {
      throw new UnauthorizedException('Authentication failed - invalid token !');
    }
    const accessToken = await this.authService.getCookie(req.user, true);
    req.res.cookie('AuthToken', accessToken, {
      httpOnly: false,
      path: '/',  // TODO test with path '/2fa/auth2fa'
    });
    return req.user
  }

  // generate a new qrcode for the user
  @UseGuards(AuthGuard('jwt'))
  @Get('generate')
  async generate(@Res() response: Response, @Request() req) {
    const { otpauthUrl } = await this.twoFactorService.generateTwoFactorSecret(req.user)

    console.log('new qrcode generate')

    return this.twoFactorService.generateQrCode(response, otpauthUrl)
  }

  // verify the token and enable 2FA for the user
  @UseGuards(AuthGuard('jwt'))
  @Post('check-token')
  async verifyToken(@Body() tokenBody: TokenDto, @Request() req) {
    const valid =  await this.twoFactorService.codeIsValid(tokenBody.token, req.user);

    if (valid) {
      await this.userService.enable2FA(req.user.id)
      logger2FA.log(`2FA enabled for user ${req.user.username}`)
    } else {
      throw new UnauthorizedException('Invalid token')
    }
  }

  // disable 2FA for the user
  @UseGuards(AuthGuard('jwt'))
  @Get('disable')
  async disable(@Request() req) {
    await this.userService.disable2FA(req.user.id)
    logger2FA.log(`2FA disabled for user ${req.user.username}`)
  }
}
