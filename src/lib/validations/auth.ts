import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { error: 'Email is required' })
      .pipe(z.email({ error: 'Invalid email address' })),
    password: z
      .string()
      .min(6, { error: 'Password must be at least 6 characters' })
      .max(72, { error: 'Password must be at most 72 characters' }),
    confirmPassword: z.string().min(1, { error: 'Please confirm your password' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword']
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { error: 'Email is required' })
    .pipe(z.email({ error: 'Invalid email address' })),
  password: z.string().min(1, { error: 'Password is required' })
});

export type LoginInput = z.infer<typeof loginSchema>;
