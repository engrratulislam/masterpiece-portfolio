import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes except /admin/login
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';
  const isApiAuth = pathname.startsWith('/api/auth');

  // Skip middleware for API auth routes
  if (isApiAuth) {
    return NextResponse.next();
  }

  // Check if user has session cookie
  const sessionCookie = request.cookies.get('authjs.session-token') ||
                        request.cookies.get('__Secure-authjs.session-token');

  const isLoggedIn = !!sessionCookie;

  // If accessing admin routes (except login) without authentication, redirect to login
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access login page, redirect to dashboard
  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Only match admin routes
    '/admin/:path*',
  ],
};
