import { environment } from './environment';

export const databaseConfig = {
  uri: environment.MONGODB_URI,
  connectionOptions: {
    maxPoolSize: 10,
    minPoolSize: 2,
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000,
    retryWrites: true,
    w: 'majority' as const,
  },
} as const;
