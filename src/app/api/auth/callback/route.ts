import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');

  console.log('[AUTH] ── PASO 2 ── Keycloak redirigió de vuelta con authorization code');

  if (errorParam) {
    console.log('[AUTH] ✗ Keycloak rechazó el login:', errorParam);
    return NextResponse.redirect(
      new URL(`/auth/login?error=${errorParam}`, request.url),
    );
  }

  const pkceCookie = request.cookies.get('oauth_pkce')?.value;
  if (!pkceCookie || !code) {
    console.log('[AUTH] ✗ Falta PKCE cookie o code. pkceCookie:', !!pkceCookie, '| code:', !!code);
    return NextResponse.redirect(new URL('/auth/login?error=bad_request', request.url));
  }

  console.log('[AUTH]    code recibido:', code.slice(0, 20) + '...');
  console.log('[AUTH]    state recibido:', state);

  let storedState: string;
  let codeVerifier: string;
  try {
    ({ state: storedState, codeVerifier } = JSON.parse(pkceCookie));
  } catch {
    console.log('[AUTH] ✗ No se pudo parsear la PKCE cookie');
    return NextResponse.redirect(new URL('/auth/login?error=bad_request', request.url));
  }

  if (state !== storedState) {
    console.log('[AUTH] ✗ state mismatch — posible CSRF. Esperado:', storedState, '| Recibido:', state);
    return NextResponse.redirect(new URL('/auth/login?error=state_mismatch', request.url));
  }

  console.log('[AUTH]    state ✓ verificado');
  console.log('[AUTH] ── PASO 3 ── Next.js intercambia code por tokens en Keycloak');
  console.log('[AUTH]    grant_type: authorization_code');
  console.log('[AUTH]    client_id: ', process.env.KEYCLOAK_CLIENT_ID);

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
    const errBody = await tokenRes.text();
    console.log('[AUTH] ✗ Token exchange falló. Status:', tokenRes.status, '| Body:', errBody);
    return NextResponse.redirect(new URL('/auth/login?error=token_exchange', request.url));
  }

  const tokens = await tokenRes.json();
  console.log('[AUTH]    Token exchange ✓');
  console.log('[AUTH]    access_token: ', tokens.access_token?.slice(0, 30) + '...');
  console.log('[AUTH]    refresh_token:', tokens.refresh_token?.slice(0, 30) + '...');
  console.log('[AUTH]    expires_in:   ', tokens.expires_in, 'segundos');
  console.log('[AUTH]    token_type:   ', tokens.token_type);

  const payloadB64 = tokens.access_token.split('.')[1];
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());

  console.log('[AUTH] ── Sesión creada ──');
  console.log('[AUTH]    sub (userId):', payload.sub);
  console.log('[AUTH]    email:       ', payload.email);
  console.log('[AUTH]    username:    ', payload.preferred_username);
  console.log('[AUTH]    AT expira en:', new Date(Date.now() + tokens.expires_in * 1000).toISOString());
  console.log('[AUTH] → Cookie highlands-session guardada. Redirigiendo a /');

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
