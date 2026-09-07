export interface Item {
  id: number;
  titulo: string;
  artista: string;
  año: number;
  sala: string;
}

// DTO para crear una obra
export type CreateItemDto = Omit<Item, 'id'>;

// DTO para actualizar una obra
export type UpdateItemDto = Partial<CreateItemDto>;

// Respuesta para un solo elemento
export interface SingleResponse<T> {
  data: T;
}

// Respuesta para listas con paginación
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Respuesta para errores
export interface ErrorResponse {
  error: string;
  message: string;
}

// Parámetros de paginación
export interface PaginationParams {
  page: number;
  limit: number;
}