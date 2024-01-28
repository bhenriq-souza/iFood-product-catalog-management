import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [NestConfigModule],
  exports: [NestConfigModule],
})
export class ConfigModule {}
