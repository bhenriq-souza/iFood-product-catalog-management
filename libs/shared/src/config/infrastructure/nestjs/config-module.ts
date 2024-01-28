import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import {
  ConfigService,
  ConfigServiceKey,
} from '@libs/shared/config/domain/services/config-service';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [
    ConfigService,
    {
      provide: ConfigServiceKey,
      useClass: ConfigService,
    },
  ],
  exports: [ConfigServiceKey, ConfigService],
})
export class ConfigModule {}
