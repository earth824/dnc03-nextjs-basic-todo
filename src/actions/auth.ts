'use server';

import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/session';
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput
} from '@/lib/validations/auth';

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

  redirect('/login?registered=1');
}

export type LoginState = {
  message?: string;
  fieldErrors?: Partial<Record<keyof LoginInput, string[]>>;
};

const INVALID_CREDENTIALS = 'Invalid email or password';

export async function login(input: LoginInput): Promise<LoginState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      message: 'Invalid form data',
      fieldErrors: z.flattenError(parsed.error).fieldErrors
    };
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, password: true }
    });

    // Same message for unknown email and wrong password, so attackers
    // can't tell which emails are registered.
    const valid = user ? await bcrypt.compare(password, user.password) : false;
    if (!user || !valid) {
      return { message: INVALID_CREDENTIALS };
    }

    await createSession(user.id);
  } catch (error) {
    console.error('login failed', error);
    return { message: 'Something went wrong. Please try again.' };
  }

  redirect('/dashboard');
}
