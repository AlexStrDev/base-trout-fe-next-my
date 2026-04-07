import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/auth/login', request.url));
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  session.destroy();

  const keycloakBase = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`;
  const logoutUrl = new URL(`${keycloakBase}/protocol/openid-connect/logout`);
  logoutUrl.searchParams.set('client_id', process.env.KEYCLOAK_CLIENT_ID!);
  logoutUrl.searchParams.set(
    'post_logout_redirect_uri',
    `${process.env.NEXTAUTH_URL}/auth/login`,
  );

  return NextResponse.redirect(logoutUrl.toString());
}
