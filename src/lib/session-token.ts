// JWT helpers with no dependency on next/headers, so both Proxy
// (request.cookies) and server code (cookies()) can share them.
import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE_NAME = 'session';

export type SessionPayload = {
  userId: number;
};

function getKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function encryptSession(
  payload: SessionPayload,
  expiresAt: Date
) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(getKey());
}

export async function decryptSession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getKey(), {
      algorithms: ['HS256']
    });
    return payload;
  } catch {
    // Expired or tampered token
    return null;
  }
}
