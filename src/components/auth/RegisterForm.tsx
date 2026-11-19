'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerUser } from '@/actions/auth';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';

const fields = [
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'new-password'
  },
  {
    name: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    autoComplete: 'new-password'
  }
] as const;

export default function RegisterForm() {
  const [formError, setFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  });

  const onSubmit = async (data: RegisterInput) => {
    setFormError(undefined);
    // On success the server function redirects to /login.
    const result = await registerUser(data);

    if (result.fieldErrors) {
      for (const [name, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          setError(name as keyof RegisterInput, { message: messages[0] });
        }
      }
    }
    if (result.message) {
      setFormError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {fields.map(({ name, label, type, autoComplete }) => (
        <div key={name} className="space-y-1">
          <label htmlFor={name} className="block text-sm font-medium">
            {label}
          </label>
          <input
            id={name}
            type={type}
            autoComplete={autoComplete}
            aria-invalid={errors[name] ? 'true' : 'false'}
            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 aria-invalid:border-red-500"
            {...register(name)}
          />
          {errors[name] && (
            <p className="text-sm text-red-600">{errors[name].message}</p>
          )}
        </div>
      ))}

      {formError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Creating account...' : 'Register'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
