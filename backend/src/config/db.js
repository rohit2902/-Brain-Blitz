import mongoose from 'mongoose';

export const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in the environment variables.');
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    
    return connection;
  } catch (error) {
    // console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
