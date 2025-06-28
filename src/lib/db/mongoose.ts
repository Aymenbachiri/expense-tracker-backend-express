import mongoose from 'mongoose';
import { MONGODB_URI } from '../../config/config';
import type { ConnectOptions } from 'mongoose';

const clientOptions: ConnectOptions = {
  dbName: 'expense-tracker',
  appName: 'expense-tracker',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToMongoDB = async (): Promise<void> => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables');
  }

  try {
    await mongoose.connect(MONGODB_URI, clientOptions);

    console.log('MongoDB connected successfully', {
      uri: MONGODB_URI,
      options: clientOptions,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error('MongoDB connection error', error);
  }
};
