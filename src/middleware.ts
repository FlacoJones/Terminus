import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Check if we're on the CAD subdomain
  if (host.startsWith('cad.')) {
    // Don't rewrite if already on a /cad path to avoid loops
    if (!url.pathname.startsWith('/cad')) {
      url.pathname = `/cad${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
