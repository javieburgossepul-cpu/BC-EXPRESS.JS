// src/models/secondary.model.ts — Entidad Secundaria: Artista
import { Schema, model } from 'mongoose';

export interface IArtist {
  nombre: string;
  nacionalidad?: string;
  añoNacimiento?: number;
}

const artistSchema = new Schema<IArtist>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxlength: 100,
      unique: true,
    },
    nacionalidad: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    anioNacimiento: {
      type: Number,
      min: 0,
      max: new Date().getFullYear(),
    },
  },
  { timestamps: true },
);

export const Artist = model<IArtist>('Artist', artistSchema);
export const Secondary = Artist;
