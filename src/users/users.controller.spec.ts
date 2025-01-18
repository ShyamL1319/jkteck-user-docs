import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { getInitializedDataSource } from '../database/datasource.provider';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserRepository, UsersService, ConfigService, DataSource],
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

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
