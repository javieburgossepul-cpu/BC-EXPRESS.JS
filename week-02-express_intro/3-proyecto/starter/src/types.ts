// ============================================
// TYPES: Interfaz del recurso principal
// ============================================

export interface Item {
  id: number;
  titulo: string;
  artista: string;
  año: number;
  sala: string;
}

// DTO usado para crear un nuevo item (sin id, se genera automáticamente)
export type CreateItemDto = Omit<Item, 'id'>;

// DTO para actualización (todos los campos editables)
export type UpdateItemDto = Partial<CreateItemDto>;