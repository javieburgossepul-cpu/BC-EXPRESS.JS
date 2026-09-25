import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede exceder 100 caracteres')
      .regex(/^[^<>]*$/, 'El nombre no debe contener caracteres HTML'),
    email: z
      .string()
      .email('Formato de email inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['user', 'admin']).optional().default('user'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email('Formato de email inválido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida'),
  }),
});

export type RegisterDto = z.infer<typeof registerSchema>['body'];
export type LoginDto = z.infer<typeof loginSchema>['body'];
