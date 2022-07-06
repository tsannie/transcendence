import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use((req, res, next) => {
    next();
  });
  app.enableCors({
    origin: true,
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe()); // enable ValidationPipe
  await app.listen(3000);
}
bootstrap();
