import { DataSource, DataSourceOptions } from 'typeorm';
import { KafkaEvent } from '../ingestion/kafka-event.entity';

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
    host: process.env.DATABASE_HOST || 'localhost',
    username: process.env.DATABASE_USER || 'conduktor',
    password: process.env.DATABASE_PASSWORD || 'change_me',
    entities: [KafkaEvent],
    database: database || process.env.DATABASE_NAME || 'user_docs_management',
    port: parseInt(port || process.env.DATABASE_PORT) || 5432,
  } as DataSourceOptions);

  return dataSource.initialize();
};
