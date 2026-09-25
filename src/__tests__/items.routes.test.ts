// ============================================================
// INTEGRATION TESTS — items/obras routes (Supertest + MongoMemoryServer)
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';
import { ItemModel } from '../models/item.model';
import { UserModel } from '../models/user.model';

describe('Items / Obras Routes — Integration Tests', () => {
  let mongod: MongoMemoryServer;
  let userToken: string;
  let user2Token: string;
  let adminToken: string;
  let userId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);

    // Registrar e iniciar sesión como Curador Principal (Rol: user)
    const curadorRegister = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Curador Principal', email: 'curador@museo.com', password: 'Password123!' });
    const curadorData = (curadorRegister.body.data || curadorRegister.body) as { _id?: string; id?: string };
    userId = String(curadorData._id || curadorData.id);

    const userLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'curador@museo.com', password: 'Password123!' });
    userToken = userLogin.body.accessToken;

    // Registrar e iniciar sesión como Curador Secundario (Otro user)
    await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Curador Secundario', email: 'curador2@museo.com', password: 'Password123!' });

    const user2Login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'curador2@museo.com', password: 'Password123!' });
    user2Token = user2Login.body.accessToken;

    // Registrar usuario y promoverlo a admin en BD
    await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'Admin Museo', email: 'admin@museo.com', password: 'Password123!' });
    await UserModel.updateOne({ email: 'admin@museo.com' }, { role: 'admin' });

    const adminLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@museo.com', password: 'Password123!' });
    adminToken = adminLogin.body.accessToken;
  }, 120000);

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await ItemModel.deleteMany({});
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongod) {
      await mongod.stop();
    }
  }, 60000);

  describe('GET /api/v1/items', () => {
    it('debe retornar 200 y un array vacío inicialmente', async () => {
      const res = await request(app).get('/api/v1/items');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
      expect(res.body.total).toBe(0);
    });

    it('debe retornar 200 con la lista de obras registradas', async () => {
      await ItemModel.create({
        titulo: 'La Gioconda',
        codigo: 'MUS-001',
        año: 1503,
        tecnica: 'Óleo sobre tabla',
        valorEstimado: 860000000,
        estaExhibida: true,
        createdBy: userId,
      });

      const res = await request(app).get('/api/v1/items');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].titulo).toBe('La Gioconda');
      expect(res.body.data[0].año).toBe(1503);
    });
  });

  describe('POST /api/v1/items', () => {
    const validObra = {
      titulo: 'La noche estrellada',
      codigo: 'MUS-002',
      año: 1889,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 100000000,
      estaExhibida: true,
    };

    it('debe retornar 201 y crear la obra con datos válidos y token de autenticación', async () => {
      const res = await request(app)
        .post('/api/v1/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validObra);

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.titulo).toBe('La noche estrellada');
      expect(res.body.data.año).toBe(1889);
      expect(res.body.data.codigo).toBe('MUS-002');
    });

    it('debe retornar 401 si no se envía el token de autenticación', async () => {
      const res = await request(app).post('/api/v1/items').send(validObra);

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    it('debe retornar 422 si los datos no cumplen las validaciones del esquema Zod', async () => {
      const invalidObra = {
        titulo: 'A', // min 2
        codigo: 'M', // min 3
        año: -50, // min 0
      };

      const res = await request(app)
        .post('/api/v1/items')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidObra);

      expect(res.status).toBe(422);
      expect(res.body.error).toBe('Validation error');
      expect(res.body.details).toBeDefined();
    });
  });

  describe('GET /api/v1/items/:id', () => {
    it('debe retornar 200 con la obra existente cuando se consulta por su ID', async () => {
      const obra = await ItemModel.create({
        titulo: 'Guernica',
        codigo: 'MUS-003',
        año: 1937,
        tecnica: 'Óleo sobre lienzo',
        valorEstimado: 200000000,
        estaExhibida: false,
        createdBy: userId,
      });

      const res = await request(app).get(`/api/v1/items/${obra._id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.titulo).toBe('Guernica');
      expect(res.body.data.año).toBe(1937);
    });

    it('debe retornar 404 cuando el ID no existe en la base de datos', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/v1/items/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Obra de arte no encontrada');
    });
  });

  describe('PUT /api/v1/items/:id', () => {
    it('debe retornar 200 cuando el curador dueño actualiza su propia obra', async () => {
      const obra = await ItemModel.create({
        titulo: 'El grito',
        codigo: 'MUS-004',
        año: 1893,
        tecnica: 'Óleo y pastel',
        valorEstimado: 120000000,
        estaExhibida: true,
        createdBy: userId,
      });

      const res = await request(app)
        .put(`/api/v1/items/${obra._id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          año: 1895,
          valorEstimado: 130000000,
        });

      expect(res.status).toBe(200);
      expect(res.body.data.año).toBe(1895);
      expect(res.body.data.valorEstimado).toBe(130000000);
    });

    it('debe retornar 403 cuando otro curador intenta actualizar una obra ajena', async () => {
      const obra = await ItemModel.create({
        titulo: 'El grito',
        codigo: 'MUS-004',
        año: 1893,
        tecnica: 'Óleo y pastel',
        valorEstimado: 120000000,
        estaExhibida: true,
        createdBy: userId,
      });

      const res = await request(app)
        .put(`/api/v1/items/${obra._id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send({ valorEstimado: 999999 });

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Permisos insuficientes para modificar esta obra');
    });
  });

  describe('DELETE /api/v1/items/:id', () => {
    it('debe retornar 204 cuando el dueño elimina la obra', async () => {
      const obra = await ItemModel.create({
        titulo: 'Obra a eliminar',
        codigo: 'MUS-DEL',
        año: 2000,
        tecnica: 'Acrílico',
        valorEstimado: 10000,
        estaExhibida: false,
        createdBy: userId,
      });

      const res = await request(app)
        .delete(`/api/v1/items/${obra._id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(204);

      const check = await ItemModel.findById(obra._id);
      expect(check).toBeNull();
    });

    it('debe retornar 403 cuando un usuario no autorizado intenta eliminar la obra', async () => {
      const obra = await ItemModel.create({
        titulo: 'Obra protegida',
        codigo: 'MUS-PROT',
        año: 2010,
        tecnica: 'Acuarela',
        valorEstimado: 50000,
        estaExhibida: true,
        createdBy: userId,
      });

      const res = await request(app)
        .delete(`/api/v1/items/${obra._id}`)
        .set('Authorization', `Bearer ${user2Token}`);

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Permisos insuficientes para eliminar esta obra');
    });

    it('debe retornar 204 cuando el admin elimina cualquier obra', async () => {
      const obra = await ItemModel.create({
        titulo: 'Obra borrada por admin',
        codigo: 'MUS-ADM',
        año: 2015,
        tecnica: 'Escultura',
        valorEstimado: 70000,
        estaExhibida: true,
        createdBy: userId,
      });

      const res = await request(app)
        .delete(`/api/v1/items/${obra._id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(204);
    });
  });
});
