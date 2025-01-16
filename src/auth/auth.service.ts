import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUserById(userData: object) {
    return await this.userService.findOne({ ...userData });
  }

  async signUp(signupDto: Partial<User>): Promise<Partial<User>> {
    delete signupDto.roles;
    return this.userService.create(signupDto);
  }

  async login(loginDto: Partial<User>): Promise<any> {
    const userResult = await this.userService.signIn(loginDto);

    if (!userResult) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const payload = { userResult };
    const accessToken = await this.jwtService.sign(payload);

    const signInResponse: any = { user: userResult, accessToken };

    return signInResponse;
  }
}
