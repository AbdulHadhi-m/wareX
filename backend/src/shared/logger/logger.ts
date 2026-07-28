import pino from 'pino';
import { environment } from '../config/environment';
import { appConfig } from '../config/app';

const transport = appConfig.isProduction
  ? pino.transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination: `${environment.LOG_FILE_PATH}/info.log`, mkdir: true },
          level: 'info',
        },
        {
          target: 'pino/file',
          options: { destination: `${environment.LOG_FILE_PATH}/error.log`, mkdir: true },
          level: 'error',
        },
        {
          target: 'pino/file',
          options: { destination: 1 },
          level: environment.LOG_LEVEL,
        },
      ],
    })
  : pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    });

export const logger = pino(
  {
    name: appConfig.name,
    level: environment.LOG_LEVEL,
    redact: ['req.headers.authorization', 'req.headers.cookie'],
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err,
    },
  },
  transport,
);
