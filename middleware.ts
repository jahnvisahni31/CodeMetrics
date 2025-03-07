import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || 
      req.nextUrl.pathname.startsWith('/problems') || 
      req.nextUrl.pathname.startsWith('/profile') || 
      req.nextUrl.pathname.startsWith('/settings')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Auth routes (prevent authenticated users from accessing)
  if (session && (
    req.nextUrl.pathname.startsWith('/auth/login') || 
    req.nextUrl.pathname.startsWith('/auth/signup')
  )) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/problems/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/auth/login',
    '/auth/signup',
  ],
};