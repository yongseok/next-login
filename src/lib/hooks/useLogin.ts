'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { signinAction } from '@/app/actions/auth';
import { LoginFormErrors } from '@/lib/validations/loginSchema';

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
 * const { isLoading, loginWithOAuth, loginWithCredentials, error } = useLogin();
 *
 * <LoginForm
 *  isLoading={isLoading}
 *  loginWithOAuth={loginWithOAuth}
 *  loginWithCredentials={loginWithCredentials}
 *  error={error}
 * />
 * ```
 */
export const useLogin = (): UseLoginReturn => {
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
      const result = await signinAction(
        {
          success: false,
          message: '',
          errors: {},
        },
        formData
      );

      if (result.success) {
        window.location.href = '/';
      } else {
        if (result.errors) {
          setError(result.errors);
        } else {
          setError({
            CredentialsError: result.message,
          });
        }
      }
    } catch (error) {
      console.error('🚨 Form submission error:', error);
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
