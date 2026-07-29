"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const environment_1 = require("./environment");
const app_1 = require("./app");
exports.databaseConfig = {
    uri: environment_1.environment.MONGODB_URI,
    connectionOptions: {
        maxPoolSize: app_1.appConfig.isProduction ? 50 : 10,
        minPoolSize: app_1.appConfig.isProduction ? 5 : 2,
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
        retryWrites: true,
        w: 'majority',
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        maxIdleTimeMS: 30000,
        waitQueueTimeoutMS: 5000,
    },
};
//# sourceMappingURL=database.js.map