import { Inject, Injectable } from '@nestjs/common';
import Logger, { LoggerKey } from '@libs/shared/logger/domain/logger';

@Injectable()
export class AppService {
  constructor(@Inject(LoggerKey) private logger: Logger) {}

  getHello(): string {
    this.logger.info('Hello World! 123');
    return 'Hello World!';
  }
}
