import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;

  const res = NextResponse.next();
  const jwtPayload = await getToken({ req });
  if (!jwtPayload) {
    // if user isn't logged in and path is index page, rewrite to
    // index-public isr page
    if (pathname === '/') {
      return NextResponse.rewrite(`${origin}/index-public`);
    }

    // if user isn't logged in and path starts with mumble, rewrite to
    // mumble-public isr page
    if (pathname.startsWith('/mumble')) {
      const id = pathname.split('/').pop();
      return NextResponse.rewrite(`${origin}/mumble-public/${id}`);
    }

    const url = new URL(`/auth/login`, req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
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
     * - manifest.json, icon-, sw.js, workbox- (pwa files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icon-|sw.js|workbox-|auth).*)',
  ],
};
