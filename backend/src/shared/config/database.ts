import { environment } from './environment';
import { appConfig } from './app';

export const databaseConfig = {
  uri: environment.MONGODB_URI,
  connectionOptions: {
    maxPoolSize: appConfig.isProduction ? 50 : 10,
    minPoolSize: appConfig.isProduction ? 5 : 2,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    w: 'majority' as const,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxIdleTimeMS: 30000,
    waitQueueTimeoutMS: 5000,
  },
} as const;
