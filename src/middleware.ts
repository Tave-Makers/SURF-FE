import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PREFIX = [
  '/login',
  '/login/callback',
  '/signup',
  '/favicon.ico',
  '/_next',
  '/robots.txt',
  '/sitemap.xml',
];
const PUBLIC_EXACT = ['/'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API는 통과 (프록시/라우트핸들러)
  if (pathname.startsWith('/api')) return NextResponse.next();

  // public route 통과
  if (PUBLIC_EXACT.includes(pathname)) return NextResponse.next();
  if (PUBLIC_PREFIX.some((p) => pathname.startsWith(p))) return NextResponse.next();

  // optimistic 통과
  const hasAccess = req.cookies.has('accessToken');
  const hasRefresh = req.cookies.has('refreshToken');

  if (!hasAccess && !hasRefresh) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
