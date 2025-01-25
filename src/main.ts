import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<any>(AppModule);

  app.use(morgan('common'));

  await app.startAllMicroservices();
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Docs Management')
      .setDescription('Docs Management')
      .build(),
  );

  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`This application is running on: ${await app.getUrl()}`);
}
bootstrap();
