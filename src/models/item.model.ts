import mongoose, { Schema, Document } from 'mongoose';

// ============================================================
// MODELO DE OBRA DE ARTE (DOMINIO: MUSEO)
// ============================================================

export interface IItem extends Document {
  titulo: string;
  codigo: string;
  año: number;
  tecnica: string;
  valorEstimado: number;
  estaExhibida: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type IObra = IItem;

const ItemSchema = new Schema<IItem>(
  {
    titulo: {
      type: String,
      required: [true, 'El título de la obra es requerido'],
      trim: true,
    },
    codigo: {
      type: String,
      required: [true, 'El código de inventario es requerido'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    año: {
      type: Number,
      required: [true, 'El año de creación es requerido'],
    },
    tecnica: {
      type: String,
      required: [true, 'La técnica o medio es requerida'],
      trim: true,
    },
    valorEstimado: {
      type: Number,
      required: [true, 'El valor estimado es requerido'],
      min: [0, 'El valor estimado no puede ser negativo'],
    },
    estaExhibida: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: [true, 'El usuario creador es requerido'],
    },
  },
  { timestamps: true }
);

ItemSchema.pre('validate', function (next) {
  if (this.año === undefined && (this as unknown as Record<string, unknown>)['anio'] !== undefined) {
    this.año = (this as unknown as Record<string, unknown>)['anio'] as number;
  }
  next();
});

export const ItemModel = mongoose.model<IItem>('Item', ItemSchema);
export const ObraModel = ItemModel;
export const Item = ItemModel;
export const Obra = ObraModel;
