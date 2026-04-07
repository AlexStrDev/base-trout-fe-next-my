import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.refreshToken) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const keycloakBase = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`;
  const tokenRes = await fetch(
    `${keycloakBase}/protocol/openid-connect/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.KEYCLOAK_CLIENT_ID!,
        refresh_token: session.refreshToken,
      }),
    },
  );

  if (!tokenRes.ok) {
    const failRes = NextResponse.json({ ok: false }, { status: 401 });
    const failSession = await getIronSession<SessionData>(request, failRes, sessionOptions);
    failSession.destroy();
    await failSession.save();
    return failRes;
  }

  const tokens = await tokenRes.json();
  const payloadB64 = tokens.access_token.split('.')[1];
  const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());

  session.accessToken = tokens.access_token;
  session.accessTokenExpiresAt = Date.now() + tokens.expires_in * 1000;
  session.refreshToken = tokens.refresh_token;
  session.sub = payload.sub;
  session.email = payload.email;
  session.preferredUsername = payload.preferred_username;
  session.expiresAt = Date.now() + tokens.expires_in * 1000;
  await session.save();

  return response;
}
