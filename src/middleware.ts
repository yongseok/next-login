import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// 인증 미들웨어
export default auth((req) => {
  const { pathname } = req.nextUrl;

  console.log(
    `[${new Date().toISOString()}] 🚏 middleware | Request to: ${pathname}`
  );

  // 1. next-intl 미들웨어를 먼저 실행하여 언어 협상 처리
  const intlResponse = intlMiddleware(req);
  if (intlResponse) {
    // 언어 리다이렉트가 필요한 경우(예: 잘못된 언어 접두사)
    return intlResponse;
  }

  // 2. 인증 상태 확인
  const isAuthenticated = !!req.auth;
  const isOnSignInPage = req.nextUrl.pathname.startsWith('/login');

  if (!isAuthenticated && !isOnSignInPage) {
    const locale = routing.locales.includes(
      pathname.split('/')[1] as 'ko' | 'en'
    )
      ? pathname.split('/')[1]
      : routing.defaultLocale;
    const signInUrl = `/${locale}/login`;
    return NextResponse.redirect(new URL(signInUrl, req.url));
  }

  // 3. 인증된 경우 또는 공용 경로인 경우 요청을 그대로 진행
  return NextResponse.next();
});

// 미들웨어 적용 범위 설정
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|video|favicon.ico|placeholder.svg|.*\\.(?:mp4|jpg|jpeg|png|gif|webp|svg|css|js)).*)',
  ],
};
