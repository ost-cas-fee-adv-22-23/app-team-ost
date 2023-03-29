import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const res = NextResponse.next();
  if (pathname !== '/') {
    const token = await getToken({ req });
    if (!token) {
      const url = new URL(`/auth/login`, req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
