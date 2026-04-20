import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  accessToken?: string;
  accessTokenExpiresAt?: number;
  refreshToken?: string;
  sub?: string;
  email?: string;
  preferredUsername?: string;
  expiresAt?: number;
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

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function getAccessToken(): Promise<string | null> {
  const session = await getSession();
  if (!session.refreshToken) return null;

  if (session.accessToken && session.accessTokenExpiresAt && Date.now() < session.accessTokenExpiresAt - 30_000) {
    console.log('[AUTH]    getAccessToken → AT cacheado vigente (expira:', new Date(session.accessTokenExpiresAt).toISOString(), ')');
    return session.accessToken;
  }

  console.log('[AUTH]    getAccessToken → AT vencido o ausente, haciendo refresh a Keycloak...');

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

  if (!res.ok) {
    console.log('[AUTH] ✗ getAccessToken → refresh falló. Status:', res.status);
    return null;
  }
  const tokens = await res.json();
  console.log('[AUTH]    getAccessToken → nuevo AT obtenido ✓ (expira en', tokens.expires_in, 's)');

  session.accessToken = tokens.access_token;
  session.accessTokenExpiresAt = Date.now() + tokens.expires_in * 1000;
  if (tokens.refresh_token) session.refreshToken = tokens.refresh_token;
  await session.save();

  return tokens.access_token ?? null;
}
