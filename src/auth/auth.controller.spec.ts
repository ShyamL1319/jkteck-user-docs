import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/user.repository';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { getInitializedDataSource } from '../database/datasource.provider';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        UserRepository,
        ConfigService,
        AuthService,
        JwtService,
        DataSource,
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

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
