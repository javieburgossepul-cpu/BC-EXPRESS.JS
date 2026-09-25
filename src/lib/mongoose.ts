import mongoose from 'mongoose';

export async function connectDB(customUri?: string): Promise<void> {
  const uri = customUri ?? process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(uri);
  console.log('✅ Conexión exitosa a MongoDB');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('🔌 MongoDB desconectado');
}
