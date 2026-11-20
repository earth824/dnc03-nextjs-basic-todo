import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE_NAME, decryptSession } from '@/lib/session-token';

// Pages that require a logged-in user (prefix match)
const protectedRoutes = ['/dashboard', '/todo'];
// Pages only for guests; logged-in users get sent to the dashboard
const guestOnlyRoutes = ['/login', '/register'];

const matches = (pathname: string, routes: string[]) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimistic check: verify the JWT from the cookie only, no DB lookup.
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await decryptSession(token);
  const isAuthenticated = Boolean(session?.userId);

  if (matches(pathname, protectedRoutes) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (matches(pathname, guestOnlyRoutes) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, Next.js internals and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)']
};
