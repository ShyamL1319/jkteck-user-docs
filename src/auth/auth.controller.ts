/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from 'src/utils/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 
    Register the user 
    @param signupDTO <Partial<User>>
  */

  @Public()
  @Post('register')
  async signup(@Body() signupDto: Partial<User>): Promise<Partial<User>> {
    return this.authService.signUp(signupDto);
  }

  /**
    Login the user 
    @param loginDto <Partial<User>>
  */

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: Partial<User>): Promise<Partial<User>> {
    return this.authService.login(loginDto);
  }

  /**
    @param signupDTO <Partial<User>>
    @description It will logout the user 
  */

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    return req.logout();
  }
}
