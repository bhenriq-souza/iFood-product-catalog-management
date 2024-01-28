import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CategoryModule } from './category/category.module';

import { ConfigModule } from '@libs/shared/config/infrastructure/nestjs/config-module';
import { LoggerModule } from '@libs/shared/logger/infrastructure/nestjs/logger-module';

@Module({
  imports: [CategoryModule, LoggerModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
