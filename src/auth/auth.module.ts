import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/services/users.service';
import { UserRepository } from 'src/users/user.repository';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'JWT_Secret_JKTechAuthentication',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  providers: [AuthService, UsersService, UserRepository, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
