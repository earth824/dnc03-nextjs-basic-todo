'use client';

import { useFormStatus } from 'react-dom';
import { logout } from '@/actions/auth';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Logging out...' : 'Logout'}
    </button>
  );
}

export default function LogoutButton() {
  // A form (not onClick) so logout still works before JS has loaded.
  return (
    <form action={logout}>
      <SubmitButton />
    </form>
  );
}
