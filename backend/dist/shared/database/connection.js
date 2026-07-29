"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
exports.disconnect = disconnect;
exports.isConnected = isConnected;
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
const logger_1 = require("../logger/logger");
function maskUri(uri) {
    return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
}
async function connect() {
    mongoose_1.default.set('strictQuery', true);
    mongoose_1.default.connection.on('connected', () => {
        logger_1.logger.info({
            database: mongoose_1.default.connection.db?.databaseName,
            host: mongoose_1.default.connection.host,
        }, 'MongoDB connection established');
    });
    mongoose_1.default.connection.on('error', (err) => {
        logger_1.logger.error({ err }, 'MongoDB connection error');
    });
    mongoose_1.default.connection.on('disconnected', () => {
        logger_1.logger.warn('MongoDB disconnected');
    });
    mongoose_1.default.connection.on('reconnected', () => {
        logger_1.logger.info('MongoDB reconnected');
    });
    try {
        await mongoose_1.default.connect(database_1.databaseConfig.uri, database_1.databaseConfig.connectionOptions);
        logger_1.logger.info({
            uri: maskUri(database_1.databaseConfig.uri),
            database: mongoose_1.default.connection.db?.databaseName,
            maxPoolSize: database_1.databaseConfig.connectionOptions.maxPoolSize,
        }, 'MongoDB connection successful');
    }
    catch (error) {
        logger_1.logger.fatal({ err: error }, 'Failed to connect to MongoDB');
        throw error;
    }
}
async function disconnect() {
    try {
        await mongoose_1.default.disconnect();
        logger_1.logger.info('MongoDB connection closed');
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Error closing MongoDB connection');
    }
}
function isConnected() {
    return mongoose_1.default.connection.readyState === 1;
}
//# sourceMappingURL=connection.js.map