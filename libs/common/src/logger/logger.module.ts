import { Logger, Module } from '@nestjs/common';
import * as winston from 'winston';

@Module({
  providers: [
    Logger,
    {
      provide: 'winston',
      useValue: winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        transports: [
          new winston.transports.File({
            filename: 'error.log',
            level: 'error',
          }),
          new winston.transports.File({ filename: 'combined.log' }),
        ],
      }),
    },
  ],
  exports: [Logger],
})
export class LoggerModule {}
