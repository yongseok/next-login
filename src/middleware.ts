import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  console.log('🚀 middleware | auth | req:', req);
  const isAuthenticated = !!req.auth;
  const isOnSignInPage = req.nextUrl.pathname.startsWith('/login');

  if (!isAuthenticated && !isOnSignInPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
});

// 미들웨어 적용 범위 설정
export const config = {
  matcher: ['/about/:path*'],
};
