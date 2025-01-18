import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { UserRepository } from '../users/user.repository';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { getInitializedDataSource } from '../database/datasource.provider';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, DatabaseModule],
      providers: [
        AuthService,
        UsersService,
        UserRepository,
        JwtService,
        ConfigService,
      ],
    })
      .overrideProvider(DataSource)
      .useFactory({
        factory: async (): Promise<DataSource> => {
          return getInitializedDataSource(
            process.env.POSTGRES_TEST_DB || 'user_docs_management_test',
            process.env.POSTGRES_TEST_PORT || '5432',
          );
        },
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw UnauthorizedException if login credentials are invalid', async () => {
    const loginDto = { email: 'test', password: 'wrong' };
    jest.spyOn(usersService, 'signIn').mockResolvedValue(null);

    await expect(service.login(loginDto)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
