import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  const codeVerifier = crypto.randomBytes(64).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  const state = crypto.randomBytes(16).toString('hex');

  const keycloakBase = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`;
  const authUrl = new URL(`${keycloakBase}/protocol/openid-connect/auth`);
  authUrl.searchParams.set('client_id', process.env.KEYCLOAK_CLIENT_ID!);
  authUrl.searchParams.set(
    'redirect_uri',
    `${process.env.NEXTAUTH_URL}/api/auth/callback`,
  );
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  console.log('[AUTH] ── PASO 1 ── Browser inicia login');
  console.log('[AUTH]    Keycloak URL:', process.env.KEYCLOAK_URL);
  console.log('[AUTH]    Realm:       ', process.env.KEYCLOAK_REALM);
  console.log('[AUTH]    Client ID:   ', process.env.KEYCLOAK_CLIENT_ID);
  console.log('[AUTH]    Redirect URI:', `${process.env.NEXTAUTH_URL}/api/auth/callback`);
  console.log('[AUTH]    state:       ', state);
  console.log('[AUTH] → Redirigiendo browser a Keycloak (el usuario verá el form de login)');

  const response = NextResponse.redirect(authUrl.toString());

  // Guardar verifier y state en cookie HTTP-only temporal (5 min)
  response.cookies.set(
    'oauth_pkce',
    JSON.stringify({ state, codeVerifier }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 300,
      path: '/',
    },
  );

  return response;
}
