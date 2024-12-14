import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body('usernameOrEmail') usernameOrEmail: string,
    @Body('password') password: string,
  ) {
    if (!usernameOrEmail || !password) {
      throw new UnauthorizedException('Username/email and password are required');
    }
    return this.authService.login(usernameOrEmail, password);
  }
}
