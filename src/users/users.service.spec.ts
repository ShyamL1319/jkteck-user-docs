import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { getInitializedDataSource } from '../database/datasource.provider';

describe('UsersService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, ConfigService, UserRepository, DataSource],
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

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
