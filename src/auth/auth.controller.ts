import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signup(@Body() signupDto: Partial<User>): Promise<Partial<User>> {
    return this.authService.signUp(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: Partial<User>): Promise<Partial<User>> {
    return this.authService.login(loginDto);
  }
}
