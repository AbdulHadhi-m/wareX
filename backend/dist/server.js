"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const environment_1 = require("./shared/config/environment");
const app_2 = require("./shared/config/app");
const logger_1 = require("./shared/logger/logger");
const connection_1 = require("./shared/database/connection");
async function start() {
    try {
        await (0, connection_1.connect)();
        const server = app_1.app.listen(environment_1.environment.PORT, () => {
            logger_1.logger.info(`${app_2.appConfig.name} API is running`);
            logger_1.logger.info(`Port: ${environment_1.environment.PORT}`);
            logger_1.logger.info(`Environment: ${app_2.appConfig.nodeEnv}`);
            logger_1.logger.info(`API Prefix: ${app_2.appConfig.apiPrefix}`);
        });
        const shutdown = async (signal) => {
            logger_1.logger.info(`${signal} received, shutting down gracefully`);
            server.close(() => {
                logger_1.logger.info('HTTP server closed');
            });
            await (0, connection_1.disconnect)();
            process.exit(0);
        };
        process.on('SIGTERM', () => { shutdown('SIGTERM'); });
        process.on('SIGINT', () => { shutdown('SIGINT'); });
    }
    catch (error) {
        logger_1.logger.fatal(error, 'Failed to start server');
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map