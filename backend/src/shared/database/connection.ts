import mongoose from 'mongoose';
import { databaseConfig } from '../config/database';
import { logger } from '../logger/logger';

function maskUri(uri: string): string {
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
}

export async function connect(): Promise<void> {
  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    logger.info({
      database: mongoose.connection.db?.databaseName,
      host: mongoose.connection.host,
    }, 'MongoDB connection established');
  });

  mongoose.connection.on('error', (err) => {
    logger.error({ err }, 'MongoDB connection error');
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });

  try {
    await mongoose.connect(databaseConfig.uri, databaseConfig.connectionOptions);

    logger.info({
      uri: maskUri(databaseConfig.uri),
      database: mongoose.connection.db?.databaseName,
      maxPoolSize: databaseConfig.connectionOptions.maxPoolSize,
    }, 'MongoDB connection successful');
  } catch (error) {
    logger.fatal({ err: error }, 'Failed to connect to MongoDB');
    throw error;
  }
}

export async function disconnect(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error({ err: error }, 'Error closing MongoDB connection');
  }
}

export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
