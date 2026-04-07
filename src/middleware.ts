import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

const PUBLIC_PATHS = [
  '/auth/login',
  '/api/auth/login',
  '/api/auth/callback',
  '/api/auth/logout',
  '/api/auth/refresh',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, sessionOptions);

  if (!session.refreshToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (session.expiresAt && Date.now() > session.expiresAt) {
    const refreshUrl = new URL('/api/auth/refresh', request.url);
    const refreshRes = await fetch(refreshUrl.toString(), {
      headers: { cookie: request.headers.get('cookie') ?? '' },
    });

    if (!refreshRes.ok) {
      return redirectToLogin(request);
    }
    const nextRes = NextResponse.next();
    refreshRes.headers.getSetCookie().forEach((cookie) => {
      nextRes.headers.append('set-cookie', cookie);
    });
    return nextRes;
  }

  return response;
}

function redirectToLogin(request: NextRequest) {
  const res = NextResponse.redirect(new URL('/auth/login', request.url));
  res.cookies.delete('highlands-session');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
