import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${errorParam}`, request.url),
    );
  }

  const pkceCookie = request.cookies.get('oauth_pkce')?.value;
  if (!pkceCookie || !code) {
    return NextResponse.redirect(new URL('/auth/login?error=bad_request', request.url));
  }

  let storedState: string;
  let codeVerifier: string;
  try {
    ({ state: storedState, codeVerifier } = JSON.parse(pkceCookie));
  } catch {
    return NextResponse.redirect(new URL('/auth/login?error=bad_request', request.url));
  }

  if (state !== storedState) {
    return NextResponse.redirect(new URL('/auth/login?error=state_mismatch', request.url));
  }

  const keycloakBase = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`;
  const tokenRes = await fetch(
    `${keycloakBase}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback`,
        code,
        code_verifier: codeVerifier,
      }),
    },
  );

  if (!tokenRes.ok) {
    return NextResponse.redirect(new URL('/auth/login?error=token_exchange', request.url));
  }

  const tokens = await tokenRes.json();

  const payloadB64 = tokens.access_token.split('.')[1];
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
  const response = NextResponse.redirect(new URL('/', request.url));
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  session.accessToken = tokens.access_token;
  session.accessTokenExpiresAt = Date.now() + tokens.expires_in * 1000;
  session.refreshToken = tokens.refresh_token;
  session.sub = payload.sub;
  session.email = payload.email;
  session.preferredUsername = payload.preferred_username;
  session.expiresAt = Date.now() + tokens.expires_in * 1000;
  response.cookies.delete('oauth_pkce');

  await session.save();

  return response;
}
