import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3004);
  console.log(`This application is running on: ${await app.getUrl()}`);
}
bootstrap();
