// 예시: 테마 Provider를 클라이언트 컴포넌트로 분리
'use client';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';

export function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
