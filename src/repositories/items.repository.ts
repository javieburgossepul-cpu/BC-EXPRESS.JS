import { ItemModel, IItem } from '../models/item.model';
import type { CreateItemDto, UpdateItemDto } from '../types/index';

export async function findAllItems(filter: Record<string, unknown> = {}): Promise<IItem[]> {
  return ItemModel.find(filter).sort({ createdAt: -1 });
}

export async function findItemById(id: string): Promise<IItem | null> {
  return ItemModel.findById(id);
}

export async function findItemByCodigo(codigo: string): Promise<IItem | null> {
  return ItemModel.findOne({ codigo: codigo.toUpperCase() });
}

export async function createItem(dto: CreateItemDto, createdBy: string): Promise<IItem> {
  return ItemModel.create({
    ...dto,
    codigo: dto.codigo.toUpperCase(),
    createdBy,
  });
}

export async function updateItem(id: string, dto: UpdateItemDto): Promise<IItem | null> {
  const updateData = { ...dto };
  if (updateData.codigo) {
    updateData.codigo = updateData.codigo.toUpperCase();
  }
  return ItemModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
}

export async function deleteItem(id: string): Promise<IItem | null> {
  return ItemModel.findByIdAndDelete(id);
}
