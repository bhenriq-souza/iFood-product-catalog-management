import {
  Global,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import * as morgan from 'morgan';
import WinstonLogger, {
  WinstonLoggerTransportsKey,
} from '@libs/shared/logger/infrastructure/winston/winston-logger';
import Logger, {
  LoggerBaseKey,
  LoggerKey,
} from '@libs/shared/logger/domain/logger';
import NestjsLoggerServiceAdapter from '@libs/shared/logger/infrastructure/nestjs/logger-service-adapter';
import ConsoleTransport from '@libs/shared/logger/infrastructure/winston/transports/console-transport';
import FileTransport from '@libs/shared/logger/infrastructure/winston/transports/file-transport';
import { ConfigService } from '@libs/shared/config/domain/services/config-service';
import LoggerService from '@libs/shared/logger/domain/logger-service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: LoggerBaseKey,
      useClass: WinstonLogger,
    },
    {
      provide: LoggerKey,
      useClass: LoggerService,
    },
    {
      provide: NestjsLoggerServiceAdapter,
      useFactory: (logger: Logger) => new NestjsLoggerServiceAdapter(logger),
      inject: [LoggerKey],
    },

    {
      provide: WinstonLoggerTransportsKey,
      useFactory: (configService: ConfigService) => {
        const transports = [];

        transports.push(ConsoleTransport.createColorize());

        transports.push(FileTransport.create());

        if (configService.isProduction) {
          // if (configService.slackWebhookUrl) {
          //   transports.push(
          //     SlackTransport.create(configService.slackWebhookUrl),
          //   );
          // }
        }

        return transports;
      },
      inject: [ConfigService],
    },
  ],
  exports: [LoggerKey, NestjsLoggerServiceAdapter],
})
export class LoggerModule implements NestModule {
  public constructor(
    @Inject(LoggerKey) private logger: Logger,
    private configService: ConfigService,
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan(this.configService.isProduction ? 'combined' : 'dev', {
          stream: {
            write: (message: string) => {
              this.logger.debug(message, {
                sourceClass: 'RequestLogger',
              });
            },
          },
        }),
      )
      .forRoutes('*');
  }
}
