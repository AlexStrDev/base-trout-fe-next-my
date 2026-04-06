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
