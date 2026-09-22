import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env['MONGODB_URI'] || 'mongodb://bootcamp:bootcamp123@localhost:27017/bootcamp_dev?authSource=admin';
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
