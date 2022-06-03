import { Controller, Post, Request } from '@nestjs/common';
import { AuthService } from '../service/auth.service';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

    //@UseGuards(LocalAuthGuard)
    /*@Post('auth/login')  // login
    async login(@Request() req) {
      return this.authService.login(req.user);
    }*/
}
