import { startTransition, useActionState, useEffect, useState } from 'react';
import {
  SignupFormErrors,
  SignupForm as SignupFormType,
  signupSchema,
} from '../validations/signupSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupAction } from '@/app/actions/auth';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function useSignup() {
  const [provider, setProvider] = useState<
    'credentials' | 'google' | 'github' | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SignupFormErrors | null>(null);

  // 폼 유효성 검사
  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema(useTranslations('zod.signup'))),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 폼 제출 상태 관리 (서버 액션)
  const [state, formAction] = useActionState(signupAction, {
    success: false,
    message: '',
    errors: {},
  });

  useEffect(() => {
    if (state.success === false && state.message) {
      setError(state.errors as SignupFormErrors);
    } else if (state.success === true && state.message) {
      if (provider) {
        signIn(provider, {
          email: form.getValues('email'),
          password: form.getValues('password'),
          redirect: true,
          redirectTo: '/',
        });
      }
    }
  }, [state, form, provider]);

  // 회원가입
  const signup = async (
    provider: 'credentials' | 'google' | 'github',
    data: SignupFormType
  ) => {
    try {
      setIsLoading(true);
      setProvider(provider);
      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      setError(error as SignupFormErrors);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, form, signup };
}
