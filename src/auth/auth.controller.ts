/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signup(@Body() signupDto: Partial<User>): Promise<Partial<User>> {
    return this.authService.signUp(signupDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: Partial<User>): Promise<Partial<User>> {
    return this.authService.login(loginDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}
