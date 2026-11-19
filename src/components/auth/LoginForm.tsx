'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@/actions/auth';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';

const fields = [
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    autoComplete: 'current-password'
  }
] as const;

export default function LoginForm() {
  const [formError, setFormError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginInput) => {
    setFormError(undefined);
    // On success the server function sets the session cookie and redirects to /dashboard.
    const result = await login(data);

    if (result.fieldErrors) {
      for (const [name, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          setError(name as keyof LoginInput, { message: messages[0] });
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
        {isSubmitting ? 'Logging in...' : 'Log in'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
