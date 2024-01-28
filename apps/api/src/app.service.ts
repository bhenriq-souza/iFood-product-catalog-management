import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from '@libs/shared/logger/domain/logger';
import {
  ConfigService,
  ConfigServiceKey,
} from '@libs/shared/config/domain/services/config-service';

@Injectable()
export class AppService {
  constructor(
    @Inject(LoggerKey) private logger: Logger,
    @Inject(ConfigServiceKey) private config: ConfigService,
  ) {}

  getHello(): string {
    this.logger.info(`Hello World! 123 - ${this.config.mongoUri}`);
    return 'Hello World!';
  }
}
