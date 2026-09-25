export type UserRole = 'user' | 'admin';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

// ============================================================
// DTOs adaptados al dominio Museo (Recurso: Obra de Arte)
// ============================================================

export interface CreateItemDto {
  titulo: string;
  codigo: string;
  año: number;
  tecnica: string;
  valorEstimado: number;
  estaExhibida?: boolean;
}

export interface UpdateItemDto {
  titulo?: string;
  codigo?: string;
  año?: number;
  tecnica?: string;
  valorEstimado?: number;
  estaExhibida?: boolean;
}

// Aliases para el dominio Museo
export type CreateObraDto = CreateItemDto;
export type UpdateObraDto = UpdateItemDto;
