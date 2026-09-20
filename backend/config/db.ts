import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/osmium';
    const conn = await mongoose.connect(mongoUri);

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};
