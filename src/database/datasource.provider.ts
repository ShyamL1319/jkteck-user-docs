import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';

export const DataSourceProvider = {
  provide: DataSource,
  useFactory: async () => getInitializedDataSource(),
};

export const getInitializedDataSource = (
  database?: string,
  port?: string,
): Promise<DataSource> => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER || 'admin',
    password: process.env.DATABASE_PASSWORD || 'admin',
    entities: [User],
    database:
      database || process.env.POSTGRES_TEST_DB || 'user_docs_management_test',
    port: parseInt(port || process.env.DATABASE_PORT),
  } as DataSourceOptions);

  return dataSource.initialize();
};
