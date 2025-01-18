/* eslint-disable @typescript-eslint/no-unused-vars */
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private moduleRef: ModuleRef,
    private authService: AuthService,
  ) {
    super({
      usernameField: 'email',
      passReqToCallback: true,
      // eslint-disable-next-line prettier/prettier
      passwordField: 'password',
    });
  }

  async validate(
    request: Request,
    email: string,
    password: string,
  ): Promise<any> {
    const contextId = ContextIdFactory.getByRequest(request);
    const authService = await this.moduleRef.resolve(AuthService, contextId);
    const user = await authService.validateUserById({ email });
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    return user;
  }
}
