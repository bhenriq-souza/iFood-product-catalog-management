import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import NestjsLoggerServiceAdapter from '@libs/shared/logger/infrastructure/nestjs/logger-service-adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(app.get(NestjsLoggerServiceAdapter));
  await app.listen(3000);
}
bootstrap();
