import { Schema, model, Document, Types } from 'mongoose';

// =======================================================
// MODELO DE OBRA DE ARTE (DOMINIO: MUSEO)
// =======================================================

export interface IObra extends Document {
  titulo: string;
  codigo: string;
  año: number;
  tecnica: string;
  valorEstimado: number;
  estaExhibida: boolean;
  creadoPor: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const obraSchema = new Schema<IObra>(
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
    creadoPor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El usuario creador es requerido'],
    },
  },
  { timestamps: true }
);

export const Obra = model<IObra>('Obra', obraSchema);
export const ObraModel = Obra;
