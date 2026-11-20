import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

// Data Access Layer: the real auth check, close to the data.
// Proxy only does an optimistic redirect; never rely on it alone.
// cache() dedupes the cookie read + JWT verify within one render pass.
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/login');
  }
  return { userId: session.userId };
});
