'use client';

import { Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoginButton from './LoginButton';
import AuthFields from './AuthFields';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoginForm as UserLoginForm,
  loginSchema,
} from '@/lib/validations/loginSchema';
import { Form } from './ui/form';
import { useSession } from 'next-auth/react';
import { useLogin } from '@/lib/hooks/useLogin';

export default function LoginForm() {
  const { data: session } = useSession();
  const { isLoading, handleOAuthLogin, handleCredentialsLogin, error } =
    useLogin();
  const form = useForm<UserLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col items-center gap-2'>
          <div className='bg-indigo-100 rounded-full p-3'>
            <LogIn className='w-8 h-8 text-indigo-500' />
          </div>
          <CardTitle className='text-2xl font-bold'>로그인</CardTitle>
          <p className='text-gray-500 text-sm'>계정에 로그인하세요</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={handleCredentialsLogin} className='space-y-4'>
              <AuthFields form={form} errors={error} />
              <Button
                type='submit'
                disabled={form.formState?.isLoading || isLoading}
                className='w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold'
              >
                {form.formState?.isLoading || isLoading ? (
                  <Loader2 className='w-5 h-5 animate-spin' />
                ) : null}
                로그인
              </Button>
            </form>
          </Form>
          <div className='my-4 flex items-center'>
            <div className='flex-grow h-px bg-gray-200' />
            <span className='mx-2 text-gray-400 text-xs'>또는</span>
            <div className='flex-grow h-px bg-gray-200' />
          </div>
          <div className='flex flex-col gap-2'>
            <LoginButton
              provider='google'
              isLoading={isLoading}
              onClick={() => handleOAuthLogin('google')}
              session={session}
            />
            <LoginButton
              provider='github'
              isLoading={isLoading}
              onClick={() => handleOAuthLogin('github')}
              session={session}
            />
            {error?.OAuthError && (
              <p className='text-red-500 text-sm'>{error.OAuthError}</p>
            )}
          </div>
          <div className='flex justify-between items-center mt-2'>
            <span className='text-sm text-gray-500'>계정이 없으신가요?</span>
            <Button type='button' variant='outline' asChild className='ml-2'>
              <Link href='/signup'>회원가입</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
