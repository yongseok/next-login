// 예시: 테마 Provider를 클라이언트 컴포넌트로 분리
'use client';
import { logger } from '@/lib/swr/logger';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { SWRConfig } from 'swr';

export function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SWRConfig value={{ use: [logger] }}>
        <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
          {children}
        </ThemeProvider>
      </SWRConfig>
    </SessionProvider>
  );
}
