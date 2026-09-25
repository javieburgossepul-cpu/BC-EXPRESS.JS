// ============================================================
// UNIT TESTS — auth.service.ts
// ============================================================

jest.mock('../repositories/users.repository');
jest.mock('bcryptjs');
jest.mock('../utils/jwt');

import * as usersRepo from '../repositories/users.repository';
import * as authService from '../services/auth.service';
import bcrypt from 'bcryptjs';
import { signAccessToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';
import type { IUser } from '../models/user.model';

const mockFindByEmail = usersRepo.findUserByEmail as jest.MockedFunction<typeof usersRepo.findUserByEmail>;
const mockFindById = usersRepo.findUserById as jest.MockedFunction<typeof usersRepo.findUserById>;
const mockCreateUser = usersRepo.createUser as jest.MockedFunction<typeof usersRepo.createUser>;
const mockBcryptHash = bcrypt.hash as unknown as jest.MockedFunction<typeof bcrypt.hash>;
const mockBcryptCompare = bcrypt.compare as unknown as jest.MockedFunction<typeof bcrypt.compare>;
const mockSignToken = signAccessToken as jest.MockedFunction<typeof signAccessToken>;

const mockUser = {
  _id: '507f1f77bcf86cd799439001',
  name: 'Curador Principal',
  email: 'curador@museo.com',
  password: 'hashed-password-123',
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as IUser;

describe('AuthService — Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register()', () => {
    const registerDto = {
      name: 'Curador Principal',
      email: 'curador@museo.com',
      password: 'Password123!',
    };

    it('debe registrar un nuevo usuario y retornar sus datos seguros sin contraseña', async () => {
      mockFindByEmail.mockResolvedValue(null);
      mockBcryptHash.mockResolvedValue('hashed-password-123' as never);
      mockCreateUser.mockResolvedValue(mockUser);

      const result = await authService.register(registerDto);

      expect(mockFindByEmail).toHaveBeenCalledWith('curador@museo.com');
      expect(mockBcryptHash).toHaveBeenCalledWith('Password123!', 10);
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: 'Curador Principal',
        email: 'curador@museo.com',
        password: 'hashed-password-123',
        role: 'user',
      });
      expect(result.email).toBe('curador@museo.com');
      expect(result.password).toBeUndefined();
    });

    it('debe lanzar AppError 409 cuando el email ya está registrado', async () => {
      mockFindByEmail.mockResolvedValue(mockUser);

      await expect(authService.register(registerDto)).rejects.toMatchObject({
        statusCode: 409,
      });
      expect(mockCreateUser).not.toHaveBeenCalled();
    });
  });

  describe('login()', () => {
    const loginDto = {
      email: 'curador@museo.com',
      password: 'Password123!',
    };

    it('debe retornar accessToken y rol cuando las credenciales son válidas', async () => {
      mockFindByEmail.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(true as never);
      mockSignToken.mockReturnValue('valid.jwt.token');

      const result = await authService.login(loginDto);

      expect(mockFindByEmail).toHaveBeenCalledWith('curador@museo.com');
      expect(mockBcryptCompare).toHaveBeenCalledWith('Password123!', 'hashed-password-123');
      expect(mockSignToken).toHaveBeenCalledWith({
        sub: '507f1f77bcf86cd799439001',
        role: 'user',
      });
      expect(result).toEqual({ accessToken: 'valid.jwt.token', role: 'user' });
    });

    it('debe lanzar AppError 401 cuando el usuario no existe', async () => {
      mockFindByEmail.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('debe lanzar AppError 401 cuando la contraseña es incorrecta', async () => {
      mockFindByEmail.mockResolvedValue(mockUser);
      mockBcryptCompare.mockResolvedValue(false as never);

      await expect(authService.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
      });
    });
  });

  describe('getMe()', () => {
    it('debe retornar los datos del usuario sin la contraseña', async () => {
      mockFindById.mockResolvedValue(mockUser);

      const result = await authService.getMe('507f1f77bcf86cd799439001');

      expect(mockFindById).toHaveBeenCalledWith('507f1f77bcf86cd799439001');
      expect(result.email).toBe('curador@museo.com');
      expect(result.password).toBeUndefined();
    });

    it('debe lanzar AppError 404 cuando el usuario no existe', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(authService.getMe('507f1f77bcf86cd799439099')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});
