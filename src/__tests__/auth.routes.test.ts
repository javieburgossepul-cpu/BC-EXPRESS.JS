// ============================================================
// INTEGRATION TESTS — auth routes & health check
// ============================================================

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { app } from '../app';
import { UserModel } from '../models/user.model';

describe('Auth Routes & Health Check — Integration Tests', () => {
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
  }, 120000);

  afterEach(async () => {
    if (mongoose.connection.readyState === 1) {
      await UserModel.deleteMany({});
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

  describe('GET /api/v1/health', () => {
    it('debe retornar 200 con el estado del servicio y el dominio Museo', async () => {
      const res = await request(app).get('/api/v1/health');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'ok',
        domain: 'Museo',
        recurso: 'Obras de Arte',
      });
    });
  });

  describe('POST /api/v1/auth/register', () => {
    it('debe registrar un nuevo curador exitosamente con status 201', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Curador Picasso',
          email: 'picasso@museo.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe('picasso@museo.com');
      expect(res.body.data.password).toBeUndefined();
    });

    it('debe retornar 422 si los datos del registro son inválidos', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: '',
          email: 'invalido',
          password: '123',
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toBe('Validation error');
      expect(res.body.details).toBeDefined();
    });

    it('debe retornar 409 si el correo ya está registrado', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Curador 1',
          email: 'duplicado@museo.com',
          password: 'Password123!',
        });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Curador 2',
          email: 'duplicado@museo.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(409);
      expect(res.body.error).toBe('El email ya está registrado');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Curador Login',
          email: 'login@museo.com',
          password: 'Password123!',
        });
    });

    it('debe iniciar sesión exitosamente y retornar token JWT', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@museo.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.role).toBe('user');
    });

    it('debe retornar 401 con credenciales inválidas (password incorrecta)', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@museo.com',
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Credenciales inválidas');
    });

    it('debe retornar 422 si el body de login no cumple el schema', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'no-es-un-email',
          password: '',
        });

      expect(res.status).toBe(422);
      expect(res.body.error).toBe('Validation error');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let token: string;

    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Curador Perfil',
          email: 'perfil@museo.com',
          password: 'Password123!',
        });

      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'perfil@museo.com',
          password: 'Password123!',
        });

      token = loginRes.body.accessToken;
    });

    it('debe retornar el perfil del usuario autenticado con status 200', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.email).toBe('perfil@museo.com');
      expect(res.body.data.name).toBe('Curador Perfil');
      expect(res.body.data.password).toBeUndefined();
    });

    it('debe retornar 401 si no se envía el header Authorization', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Authentication required');
    });

    it('debe retornar 401 si el token es inválido', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer token_invalido_xyz');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid or expired token');
    });
  });
});
