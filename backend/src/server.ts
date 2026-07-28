import { app } from './app';
import { environment } from './shared/config/environment';
import { appConfig } from './shared/config/app';
import { logger } from './shared/logger/logger';

async function start(): Promise<void> {
  try {
    app.listen(environment.PORT, () => {
      logger.info(`${appConfig.name} API is running`);
      logger.info(`Port: ${environment.PORT}`);
      logger.info(`Environment: ${appConfig.nodeEnv}`);
      logger.info(`API Prefix: ${appConfig.apiPrefix}`);
    });
  } catch (error) {
    logger.fatal(error, 'Failed to start server');
    process.exit(1);
  }
}

start();