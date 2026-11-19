'use server';

import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

export type RegisterState = {
  message?: string;
  fieldErrors?: Partial<Record<keyof RegisterInput, string[]>>;
};

const EMAIL_TAKEN = 'This email is already registered';

// TIGHT COUPLING
// LOOSE COUPLING
export async function register(input: RegisterInput): Promise<RegisterState> {
  // Re-validate on the server: Server Functions are reachable via direct POST.
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      message: 'Invalid form data',
      fieldErrors: z.flattenError(parsed.error).fieldErrors
    };
  }

  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });
  if (existing) {
    return { fieldErrors: { email: [EMAIL_TAKEN] } };
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { email, password: hashedPassword }
    });
  } catch (error) {
    // Race condition: another request created the same email in between.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { fieldErrors: { email: [EMAIL_TAKEN] } };
    }
    console.error('register failed', error);
    return { message: 'Something went wrong. Please try again.' };
  }

  redirect('/login');
}
