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
  handleOAuthLogin: (provider: Provider) => Promise<void>;
  handleCredentialsLogin: (formData: FormData) => Promise<void>;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<LoginFormErrors | null>(null);

  // OAuth 로그인 처리
  const handleOAuthLogin = async (provider: Provider) => {
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
  const handleCredentialsLogin = async (formData: FormData) => {
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
          console.error('Form submission error:', result.message);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return {
    isLoading,
    currentProvider,
    error,
    handleOAuthLogin,
    handleCredentialsLogin,
  };
};
