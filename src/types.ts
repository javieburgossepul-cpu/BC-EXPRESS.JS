// ============================================
// TYPES — Dominio: Museo / Obras de Arte
// Recurso principal: Obra (Item)
// ============================================

export interface Obra {
  id: number;
  titulo: string;
  artista: string;
  anio: number;
  sala: string;
  valorEstimado: number;
  tecnica: string;
  disponible: boolean;
  createdAt: Date;
}

// Alias para compatibilidad con código genérico
export type Item = Obra;

// ============================================
// Tipos de respuesta estándar
// ============================================

export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  issues: Array<{ field: string; message: string }>;
}

export interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
