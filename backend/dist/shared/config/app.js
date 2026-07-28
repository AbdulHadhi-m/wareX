"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const environment_1 = require("./environment");
exports.appConfig = {
    name: 'wareX',
    version: '1.0.0',
    port: environment_1.environment.PORT,
    host: environment_1.environment.HOST,
    nodeEnv: environment_1.environment.NODE_ENV,
    isProduction: environment_1.environment.NODE_ENV === 'production',
    isDevelopment: environment_1.environment.NODE_ENV === 'development',
    isTest: environment_1.environment.NODE_ENV === 'test',
    apiPrefix: '/api/v1',
};
//# sourceMappingURL=app.js.map