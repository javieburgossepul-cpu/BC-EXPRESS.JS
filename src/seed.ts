import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB } from './lib/mongoose';
import { UserModel } from './models/user.model';
import { ObraModel } from './models/obra.model';

async function seed(): Promise<void> {
  await connectDB();
  console.log('Iniciando seed para el dominio Museo...');

  await ObraModel.deleteMany({});
  await UserModel.deleteMany({});
  console.log('Datos previos eliminados.');

  const hashedPassword = await bcrypt.hash('javier1234', 10);

  const admin = await UserModel.create({
    name: 'Administrador Museo',
    email: 'admin@expressjs.com',
    password: hashedPassword,
    role: 'admin',
  });

  const curador = await UserModel.create({
    name: 'Javier Sepúlveda',
    email: 'javier@expressjs.com',
    password: hashedPassword,
    role: 'user',
  });

  console.log('2 usuarios creados (admin@expressjs.com y javier@expressjs.com / javier1234).');

  const obras = await ObraModel.create([
    {
      titulo: 'La Gioconda',
      codigo: 'MUS-001',
      año: 1503,
      tecnica: 'Óleo sobre tabla de álamo',
      valorEstimado: 850000000,
      estaExhibida: true,
      creadoPor: curador._id,
    },
    {
      titulo: 'La noche estrellada',
      codigo: 'MUS-002',
      año: 1889,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 120000000,
      estaExhibida: true,
      creadoPor: curador._id,
    },
    {
      titulo: 'Guernica',
      codigo: 'MUS-003',
      año: 1937,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 200000000,
      estaExhibida: true,
      creadoPor: admin._id,
    },
    {
      titulo: 'Las Meninas',
      codigo: 'MUS-004',
      año: 1656,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 350000000,
      estaExhibida: true,
      creadoPor: admin._id,
    },
    {
      titulo: 'El nacimiento de Venus',
      codigo: 'MUS-005',
      año: 1485,
      tecnica: 'Temple sobre lienzo',
      valorEstimado: 95000000,
      estaExhibida: false,
      creadoPor: curador._id,
    },
  ]);

  console.log(`${obras.length} obras de arte creadas exitosamente.`);
  await disconnectDB();
  console.log('Seed completado.');
}

seed().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
