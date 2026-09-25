import 'dotenv/config';
import bcrypt from 'bcrypt';
import { connectDB, disconnectDB } from './lib/mongoose.js';
import { User } from './models/user.model.js';
import { Obra } from './models/obra.model.js';

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Iniciando carga de datos iniciales (Seed)...');

  // Hashear contraseñas
  const passwordAdmin = await bcrypt.hash('Admin1234!', 10);
  const passwordUser = await bcrypt.hash('User1234!', 10);

  // Limpiar e insertar usuarios
  await User.deleteMany({});
  const adminUser = await User.create({
    name: 'Administrador del Museo',
    email: 'admin@museo.com',
    password: passwordAdmin,
    role: 'admin',
  });

  const curadorUser = await User.create({
    name: 'Curador Principal',
    email: 'curador@museo.com',
    password: passwordUser,
    role: 'user',
  });

  // Usuarios adicionales para pruebas genéricas
  await User.create([
    {
      name: 'Regular User',
      email: 'user@test.com',
      password: passwordUser,
      role: 'user',
    },
    {
      name: 'Admin Test',
      email: 'admin@test.com',
      password: passwordAdmin,
      role: 'admin',
    },
  ]);

  // Limpiar e insertar obras de arte (utilizando campo 'año')
  await Obra.deleteMany({});
  await Obra.insertMany([
    {
      titulo: 'La Gioconda (Mona Lisa)',
      codigo: 'MUS-001',
      año: 1503,
      tecnica: 'Óleo sobre tabla de álamo',
      valorEstimado: 860000000,
      estaExhibida: true,
      creadoPor: curadorUser._id,
    },
    {
      titulo: 'La noche estrellada',
      codigo: 'MUS-002',
      año: 1889,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 100000000,
      estaExhibida: true,
      creadoPor: curadorUser._id,
    },
    {
      titulo: 'Guernica',
      codigo: 'MUS-003',
      año: 1937,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 200000000,
      estaExhibida: false,
      creadoPor: adminUser._id,
    },
    {
      titulo: 'El grito',
      codigo: 'MUS-004',
      año: 1893,
      tecnica: 'Óleo, temple y pastel sobre cartón',
      valorEstimado: 120000000,
      estaExhibida: true,
      creadoPor: adminUser._id,
    },
  ]);

  console.log('✅ Seed completado con éxito:');
  console.log('   👤 Admin:   admin@museo.com / Admin1234! (o admin@test.com)');
  console.log('   👤 Curador: curador@museo.com / User1234! (o user@test.com)');
  console.log('   🎨 4 Obras de arte cargadas en el inventario con el campo año');
}

async function run(): Promise<void> {
  try {
    await connectDB();
    await seedDatabase();
  } catch (error) {
    console.error('❌ Error durante la ejecución del seed:', error);
  } finally {
    await disconnectDB();
  }
}

// Ejecutar automáticamente si se llama como script
if (process.argv[1] && process.argv[1].includes('seed')) {
  run();
}
