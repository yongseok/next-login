import { auth } from '@/auth';
import { NextResponse } from 'next/server';

// 인증 미들웨어
export default auth((req) => {
  console.log(
    `[${new Date().toISOString()}] 🚏 middleware | Request to: ${
      req.nextUrl.pathname
    }`
  );

  const isAuthenticated = !!req.auth;
  const isOnSignInPage = req.nextUrl.pathname.startsWith('/login');

  if (!isAuthenticated && !isOnSignInPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
});

// 미들웨어 적용 범위 설정
export const config = {
  matcher: ['/about/:path*'],
};
