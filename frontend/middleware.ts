import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
    || pathname.startsWith('/forgot-password') || pathname.startsWith('/reset-password');
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/forgot-password', '/reset-password'],
};
