"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_1 = require("./app");
const environment_1 = require("./shared/config/environment");
const app_2 = require("./shared/config/app");
const logger_1 = require("./shared/logger/logger");
const connection_1 = require("./shared/database/connection");
const auth_model_1 = require("./modules/auth/auth.model");
async function seed() {
    const userCount = await auth_model_1.UserModel.countDocuments();
    if (userCount > 0)
        return;
    logger_1.logger.info('No users found — creating default Super Admin');
    const hashedPassword = await bcrypt_1.default.hash(environment_1.environment.SUPER_ADMIN_PASSWORD, 12);
    await auth_model_1.UserModel.create({
        name: environment_1.environment.SUPER_ADMIN_NAME,
        email: environment_1.environment.SUPER_ADMIN_EMAIL.toLowerCase(),
        password: hashedPassword,
        role: 'SuperAdmin',
    });
    logger_1.logger.info({
        email: environment_1.environment.SUPER_ADMIN_EMAIL,
    }, 'Default Super Admin created');
}
async function start() {
    try {
        const startTime = Date.now();
        await (0, connection_1.connect)();
        await seed();
        const server = app_1.app.listen(environment_1.environment.PORT, () => {
            const elapsed = Date.now() - startTime;
            logger_1.logger.info({
                port: environment_1.environment.PORT,
                environment: app_2.appConfig.nodeEnv,
                apiPrefix: app_2.appConfig.apiPrefix,
                startupTime: `${elapsed}ms`,
            }, `${app_2.appConfig.name} API started`);
        });
        let shuttingDown = false;
        const shutdown = async (signal) => {
            if (shuttingDown)
                return;
            shuttingDown = true;
            logger_1.logger.info(`${signal} received — shutting down gracefully`);
            server.close(async () => {
                logger_1.logger.info('HTTP server closed');
                await (0, connection_1.disconnect)();
                logger_1.logger.info('Graceful shutdown complete');
                process.exit(0);
            });
            setTimeout(() => {
                logger_1.logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 30000).unref();
        };
        process.on('SIGTERM', () => { shutdown('SIGTERM'); });
        process.on('SIGINT', () => { shutdown('SIGINT'); });
        process.on('uncaughtException', (error) => {
            logger_1.logger.fatal({ err: error }, 'Uncaught exception');
            shutdown('UNCAUGHT_EXCEPTION');
        });
        process.on('unhandledRejection', (reason) => {
            logger_1.logger.fatal({ err: reason }, 'Unhandled rejection');
        });
    }
    catch (error) {
        logger_1.logger.fatal({ err: error }, 'Failed to start server');
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map