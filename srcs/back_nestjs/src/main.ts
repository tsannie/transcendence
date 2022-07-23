import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe()); // enable ValidationPipe
  app.enableCors({
    origin: '*',
  });
  await app.listen(4000);
  logger.log(`Server running on port 4000`);
}
bootstrap();
