import { app } from './app';
import { environment } from './shared/config/environment';
import { appConfig } from './shared/config/app';
import { logger } from './shared/logger/logger';
import { connect, disconnect } from './shared/database/connection';

async function start(): Promise<void> {
  try {
    const startTime = Date.now();
    await connect();

    const server = app.listen(environment.PORT, () => {
      const elapsed = Date.now() - startTime;
      logger.info({
        port: environment.PORT,
        environment: appConfig.nodeEnv,
        apiPrefix: appConfig.apiPrefix,
        startupTime: `${elapsed}ms`,
      }, `${appConfig.name} API started`);
    });

    let shuttingDown = false;

    const shutdown = async (signal: string): Promise<void> => {
      if (shuttingDown) return;
      shuttingDown = true;

      logger.info(`${signal} received — shutting down gracefully`);

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnect();
        logger.info('Graceful shutdown complete');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000).unref();
    };

    process.on('SIGTERM', () => { shutdown('SIGTERM'); });
    process.on('SIGINT', () => { shutdown('SIGINT'); });
    process.on('uncaughtException', (error) => {
      logger.fatal({ err: error }, 'Uncaught exception');
      shutdown('UNCAUGHT_EXCEPTION');
    });
    process.on('unhandledRejection', (reason) => {
      logger.fatal({ err: reason }, 'Unhandled rejection');
    });
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to start server');
    process.exit(1);
  }
}

start();