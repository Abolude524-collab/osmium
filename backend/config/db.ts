import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      process.env.MONGODB_URL ||
      process.env.DATABASE_URL ||
      'mongodb://localhost:27017/osmium';

    if (!process.env.MONGO_URI && !process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
      console.warn('[MongoDB Warning] No MONGO_URI or MONGODB_URI set in production environment variables! Defaulting to localhost.');
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`[MongoDB Error] Failed to connect: ${error.message}`);
    if (process.env.NODE_ENV === 'production') {
      console.error('[MongoDB Action Required] Please configure MONGO_URI or MONGODB_URI in your Render / hosting service environment variables.');
    }
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};
