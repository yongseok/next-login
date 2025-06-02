'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { LoginFormErrors } from '@/lib/validations/loginSchema';
import { useRouter } from 'next/navigation';

type Provider = 'google' | 'github';

interface UseLoginReturn {
  isLoading: boolean;
  currentProvider: Provider | null;
  error: LoginFormErrors | null;
  loginWithOAuth: (provider: Provider) => Promise<void>;
  loginWithCredentials: (formData: FormData) => Promise<void>;
}

/**
 * 사용 예시:
 * ```tsx
 * 'use client';
 *
 * import { useLogin } from '@/lib/hooks/useLogin';
 *
 * export default function LoginForm() {
 *   const { isLoading, loginWithOAuth, loginWithCredentials, error } = useLogin();
 *
 *   // ...폼 UI 및 로직
 * }
 * ```
 */
export const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<LoginFormErrors | null>(null);

  // OAuth 로그인 처리
  const loginWithOAuth = async (provider: Provider) => {
    setError(null);
    setIsLoading(true);
    setCurrentProvider(provider);
    try {
      await signIn(provider, {
        redirect: true,
        redirectTo: '/profile',
      });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError({ OAuthError: error.message });
      } else {
        setError({ OAuthError: 'OAuth 로그인 실패' });
      }
    } finally {
      setIsLoading(false);
      setCurrentProvider(null);
    }
  };

  // 자격 증명 로그인 처리
  const loginWithCredentials = async (formData: FormData) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
        redirectTo: '/profile',
      });
      if (result?.error) {
        if (result.error.includes('CredentialsSignin')) {
          setError({
            CredentialsError: '이메일 또는 비밀번호가 일치하지 않습니다.',
          });
        } else {
          setError({ CredentialsError: result.error });
        }
      }
      if (result?.ok) {
        router.push('/profile');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setError({ CredentialsError: error.message });
      } else {
        setError({ CredentialsError: '로그인 실패' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    currentProvider,
    error,
    loginWithOAuth,
    loginWithCredentials,
  };
};
