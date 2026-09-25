// ============================================================
// UNIT TESTS — items.service.ts (Dominio Museo: Obras de Arte)
// ============================================================

jest.mock('../repositories/items.repository');

import * as itemsRepo from '../repositories/items.repository';
import * as itemsService from '../services/items.service';
import { AppError } from '../errors/AppError';
import type { IItem } from '../models/item.model';

const mockFindAll = itemsRepo.findAllItems as jest.MockedFunction<typeof itemsRepo.findAllItems>;
const mockFindById = itemsRepo.findItemById as jest.MockedFunction<typeof itemsRepo.findItemById>;
const mockFindByCodigo = itemsRepo.findItemByCodigo as jest.MockedFunction<typeof itemsRepo.findItemByCodigo>;
const mockCreate = itemsRepo.createItem as jest.MockedFunction<typeof itemsRepo.createItem>;
const mockUpdate = itemsRepo.updateItem as jest.MockedFunction<typeof itemsRepo.updateItem>;
const mockDelete = itemsRepo.deleteItem as jest.MockedFunction<typeof itemsRepo.deleteItem>;

const obraBase = {
  _id: '507f1f77bcf86cd799439011',
  titulo: 'La Gioconda',
  codigo: 'MUS-001',
  año: 1503,
  tecnica: 'Óleo sobre tabla',
  valorEstimado: 860000000,
  estaExhibida: true,
  createdBy: 'user-curador-123',
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as IItem;

describe('ItemsService (Obras de Arte) — Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll()', () => {
    it('debe retornar todas las obras de arte cuando existen registros', async () => {
      mockFindAll.mockResolvedValue([obraBase]);

      const result = await itemsService.getAll();

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0]?.titulo).toBe('La Gioconda');
      expect(result[0]?.año).toBe(1503);
    });

    it('debe retornar un arreglo vacío cuando no existen obras', async () => {
      mockFindAll.mockResolvedValue([]);

      const result = await itemsService.getAll();

      expect(mockFindAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe('getById()', () => {
    it('debe retornar la obra de arte cuando el ID existe', async () => {
      mockFindById.mockResolvedValue(obraBase);

      const result = await itemsService.getById('507f1f77bcf86cd799439011');

      expect(mockFindById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(result.titulo).toBe('La Gioconda');
      expect(result.año).toBe(1503);
    });

    it('debe lanzar AppError 404 cuando la obra no existe', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(itemsService.getById('507f1f77bcf86cd799439099')).rejects.toThrow(AppError);
      await expect(itemsService.getById('507f1f77bcf86cd799439099')).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('create()', () => {
    const createDto = {
      titulo: 'La noche estrellada',
      codigo: 'MUS-002',
      año: 1889,
      tecnica: 'Óleo sobre lienzo',
      valorEstimado: 100000000,
      estaExhibida: true,
    };

    it('debe crear y retornar la nueva obra de arte con datos válidos', async () => {
      mockFindByCodigo.mockResolvedValue(null);
      const nuevaObra = {
        ...createDto,
        _id: '507f1f77bcf86cd799439022',
        createdBy: 'user-curador-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IItem;

      mockCreate.mockResolvedValue(nuevaObra);

      const result = await itemsService.create(createDto, 'user-curador-123');

      expect(mockFindByCodigo).toHaveBeenCalledWith('MUS-002');
      expect(mockCreate).toHaveBeenCalledWith(createDto, 'user-curador-123');
      expect(result.titulo).toBe('La noche estrellada');
      expect(result.año).toBe(1889);
    });

    it('debe lanzar AppError 409 cuando el código de inventario ya existe', async () => {
      mockFindByCodigo.mockResolvedValue(obraBase);

      await expect(itemsService.create(createDto, 'user-curador-123')).rejects.toThrow(AppError);
      await expect(itemsService.create(createDto, 'user-curador-123')).rejects.toMatchObject({
        statusCode: 409,
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    const updateDto = {
      valorEstimado: 900000000,
      año: 1504,
    };

    it('debe actualizar y retornar la obra cuando el solicitante es el curador creador (dueño)', async () => {
      mockFindById.mockResolvedValue(obraBase);
      const obraActualizada = {
        ...obraBase,
        ...updateDto,
      } as unknown as IItem;
      mockUpdate.mockResolvedValue(obraActualizada);

      const result = await itemsService.update(
        '507f1f77bcf86cd799439011',
        updateDto,
        'user-curador-123',
        'user'
      );

      expect(mockFindById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockUpdate).toHaveBeenCalledWith('507f1f77bcf86cd799439011', updateDto);
      expect(result.valorEstimado).toBe(900000000);
      expect(result.año).toBe(1504);
    });

    it('debe actualizar la obra cuando el solicitante tiene rol admin', async () => {
      mockFindById.mockResolvedValue(obraBase);
      mockUpdate.mockResolvedValue(obraBase);

      const result = await itemsService.update(
        '507f1f77bcf86cd799439011',
        updateDto,
        'admin-user-456',
        'admin'
      );

      expect(mockUpdate).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('debe lanzar AppError 403 cuando el solicitante no es dueño ni admin', async () => {
      mockFindById.mockResolvedValue(obraBase);

      await expect(
        itemsService.update('507f1f77bcf86cd799439011', updateDto, 'otro-usuario', 'user')
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockUpdate).not.toHaveBeenCalled();
    });

    it('debe lanzar AppError 404 cuando la obra a actualizar no existe', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        itemsService.update('507f1f77bcf86cd799439099', updateDto, 'user-curador-123', 'user')
      ).rejects.toMatchObject({ statusCode: 404 });
    });

    it('debe lanzar AppError 409 si el nuevo código entra en conflicto con otra obra', async () => {
      mockFindById.mockResolvedValue(obraBase);
      const otraObra = {
        _id: '507f1f77bcf86cd799439099',
        codigo: 'MUS-999',
      } as unknown as IItem;
      mockFindByCodigo.mockResolvedValue(otraObra);

      await expect(
        itemsService.update(
          '507f1f77bcf86cd799439011',
          { codigo: 'MUS-999' },
          'user-curador-123',
          'user'
        )
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('debe lanzar AppError 404 si updateItem retorna null', async () => {
      mockFindById.mockResolvedValue(obraBase);
      mockUpdate.mockResolvedValue(null);

      await expect(
        itemsService.update('507f1f77bcf86cd799439011', updateDto, 'user-curador-123', 'user')
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('remove()', () => {
    it('debe eliminar la obra cuando el solicitante es el dueño', async () => {
      mockFindById.mockResolvedValue(obraBase);
      mockDelete.mockResolvedValue(obraBase);

      await itemsService.remove('507f1f77bcf86cd799439011', 'user-curador-123', 'user');

      expect(mockFindById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
      expect(mockDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('debe eliminar la obra cuando el solicitante es admin', async () => {
      mockFindById.mockResolvedValue(obraBase);
      mockDelete.mockResolvedValue(obraBase);

      await itemsService.remove('507f1f77bcf86cd799439011', 'admin-id', 'admin');

      expect(mockDelete).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('debe lanzar AppError 403 cuando el solicitante no es dueño ni admin', async () => {
      mockFindById.mockResolvedValue(obraBase);

      await expect(
        itemsService.remove('507f1f77bcf86cd799439011', 'otro-usuario', 'user')
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockDelete).not.toHaveBeenCalled();
    });

    it('debe lanzar AppError 404 cuando la obra a eliminar no existe', async () => {
      mockFindById.mockResolvedValue(null);

      await expect(
        itemsService.remove('507f1f77bcf86cd799439099', 'user-curador-123', 'user')
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
