import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  // NO guardamos accessToken ni idToken — son JWTs grandes que superan los 4096 bytes del cookie.
  // El access token se obtiene inline via refresh cuando se necesita.
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

/** Obtiene un access token fresco llamando al endpoint de token de Keycloak con el refresh token. */
export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session.refreshToken) return null;

  const keycloakBase = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`;
  const res = await fetch(`${keycloakBase}/protocol/openid-connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: process.env.KEYCLOAK_CLIENT_ID!,
      refresh_token: session.refreshToken,
    }),
  });

  if (!res.ok) return null;
  const tokens = await res.json();
  return tokens.access_token ?? null;
}
