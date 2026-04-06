import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  sub?: string;
  email?: string;
  preferredUsername?: string;
  expiresAt?: number; // ms timestamp
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'highlands-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

/** Lee la sesión desde server components y server actions. */
export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

/** Devuelve el access token o null si no hay sesión. */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  return session.accessToken ?? null;
}
