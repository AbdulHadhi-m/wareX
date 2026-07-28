import { environment } from './environment';

export const appConfig = {
  name: 'wareX',
  version: '1.0.0',
  port: environment.PORT,
  host: environment.HOST,
  nodeEnv: environment.NODE_ENV,
  isProduction: environment.NODE_ENV === 'production',
  isDevelopment: environment.NODE_ENV === 'development',
  isTest: environment.NODE_ENV === 'test',
  apiPrefix: '/api/v1',
} as const;
