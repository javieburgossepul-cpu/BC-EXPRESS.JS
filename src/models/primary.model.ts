// src/models/primary.model.ts — Entidad Principal: Obra de Arte
import { Schema, model, Types } from 'mongoose';

export interface IArtwork {
  titulo: string;
  codigoInventario: string;
  año: number;
  tecnica: string;
  valorEstimado: number;
  enExhibicion: boolean;
  artista: Types.ObjectId;
}

const artworkSchema = new Schema<IArtwork>(
  {
    titulo: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      maxlength: 150,
    },
    codigoInventario: {
      type: String,
      required: [true, 'El código de inventario es requerido'],
      trim: true,
      unique: true,
      maxlength: 50,
    },
    año: {
      type: Number,
      required: [true, 'El año de creación es requerido'],
      min: 0,
      max: new Date().getFullYear(),
    },
    tecnica: {
      type: String,
      required: [true, 'La técnica o material es requerido'],
      trim: true,
      maxlength: 100,
    },
    valorEstimado: {
      type: Number,
      required: [true, 'El valor estimado es requerido'],
      min: 0,
    },
    enExhibicion: {
      type: Boolean,
      default: true,
    },
    artista: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'La referencia al artista es requerida'],
    },
  },
  { timestamps: true },
);

export const Artwork = model<IArtwork>('Artwork', artworkSchema);
export const Primary = Artwork;
