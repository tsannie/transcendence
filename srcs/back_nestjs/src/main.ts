import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Main (main.ts)');
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use((req, res, next) => {
    next();
  });
  app.useGlobalPipes(new ValidationPipe()); // enable ValidationPipe
  app.enableCors({
    origin: true,
    credentials: true,
  });
  await app.listen(4000);
  logger.log(`Server running on port 4000`);
}
bootstrap();
