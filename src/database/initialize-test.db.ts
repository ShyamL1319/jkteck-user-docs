import { getInitializedDataSource } from './datasource.provider';

async function initTestDatabase() {
  try {
    const dataSource = await getInitializedDataSource(
      process.env.DATABASE_HOST,
      process.env.POSTGRES_PORT,
    );

    await dataSource.synchronize();
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

initTestDatabase();
