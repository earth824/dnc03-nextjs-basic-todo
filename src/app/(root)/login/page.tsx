import { Suspense } from 'react';
import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import RegisteredModal from '@/components/auth/RegisteredModal';

export const metadata: Metadata = {
  title: 'Login'
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Log in</h1>
        <LoginForm />
      </div>

      {/* Reads searchParams at request time, so it streams in behind a boundary */}
      <Suspense fallback={null}>
        <RegisteredModal />
      </Suspense>
    </main>
  );
}
