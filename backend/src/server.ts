import { app } from './app';
import { environment } from './shared/config/environment';
import { appConfig } from './shared/config/app';
import { logger } from './shared/logger/logger';
import { connect, disconnect } from './shared/database/connection';

async function start(): Promise<void> {
  try {
    await connect();

    const server = app.listen(environment.PORT, () => {
      logger.info(`${appConfig.name} API is running`);
      logger.info(`Port: ${environment.PORT}`);
      logger.info(`Environment: ${appConfig.nodeEnv}`);
      logger.info(`API Prefix: ${appConfig.apiPrefix}`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, shutting down gracefully`);
      server.close(() => {
        logger.info('HTTP server closed');
      });
      await disconnect();
      process.exit(0);
    };

    process.on('SIGTERM', () => { shutdown('SIGTERM'); });
    process.on('SIGINT', () => { shutdown('SIGINT'); });
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
}

start();