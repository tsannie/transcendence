import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/service/user.service';
import { AuthService } from 'src/auth/service/auth.service';
import { logger2FA } from '../const/const';
import { TokenDto } from '../dto/token.dto';
import { TwoFactorService } from '../service/two-factor.service';
import JwtGuard from 'src/auth/guard/jwt.guard';
import JwtTwoFactorGuard from 'src/auth/guard/jwtTwoFactor.guard';

@Controller('2fa')
export class TwoFactorController {
  constructor(
    private readonly twoFactorService: TwoFactorService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtGuard)
  @Post('auth2fa')
  async auth2fa(@Body() tokenBody: TokenDto, @Request() req) {
    console.log('auth2fa: ', tokenBody.token);
    const validToken = await this.twoFactorService.codeIsValid(
      tokenBody.token,
      req.user,
    );
    if (!validToken) {
      throw new UnauthorizedException(
        'Authentication failed - invalid token !',
      );
    }
    const accessToken = await this.authService.getCookie(req.user, true);
    req.res.cookie('AuthToken', accessToken, {
      httpOnly: false,
      path: '/',
    });
    return req.user;
  }

  // generate a new qrcode for the user
  @UseGuards(JwtTwoFactorGuard)
  @Get('generate')
  async generate(@Res() response: Response, @Request() req) {
    console.log('user', req.user);
    const { otpauthUrl } = await this.twoFactorService.generateTwoFactorSecret(
      req.user,
    );

    console.log('new qrcode generate');

    return this.twoFactorService.generateQrCode(response, otpauthUrl);
  }

  // verify the token and enable 2FA for the user
  @UseGuards(JwtTwoFactorGuard)
  @Post('check-token')
  async verifyToken(@Body() tokenBody: TokenDto, @Request() req) {
    console.log(req.user);
    const valid = await this.twoFactorService.codeIsValid(
      tokenBody.token,
      req.user,
    );

    console.log('verifyToken: ', valid);

    if (valid) {
      await this.userService.enable2FA(req.user.id);
      logger2FA.log(`2FA enabled for user ${req.user.username}`);
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // disable 2FA for the user
  @UseGuards(JwtTwoFactorGuard)
  @Get('disable')
  async disable(@Request() req) {
    await this.userService.disable2FA(req.user.id);
    logger2FA.log(`2FA disabled for user ${req.user.username}`);
  }
}
