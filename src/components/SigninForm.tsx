'use client';

import { signinAction } from '@/app/actions/auth';
import { LoginFormErrors } from '@/lib/validations/loginSchema';
import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signIn } from 'next-auth/react';

export default function SigninForm() {
  const [error, setError] = useState<LoginFormErrors | null>(null);

  async function onSubmit(formData: FormData) {
    try {
      const result = await signinAction(
        {
          success: false,
          message: '',
          errors: {},
        },
        formData
      );
      if (!result.success) {
        if (result.errors) {
          setError(result.errors);
        } else {
          console.error('Form submission error:', result.message);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

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
          <form action={onSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <Input
                type='email'
                name='email'
                placeholder='이메일을 입력하세요'
                className='bg-gray-50'
              />
              {error?.email && (
                <p className='text-sm text-red-500'>{error.email}</p>
              )}
            </div>
            <div className='space-y-2'>
              <label htmlFor='password' className='text-sm font-medium'>
                Password
              </label>
              <Input
                type='password'
                name='password'
                placeholder='비밀번호를 입력하세요'
                className='bg-gray-50'
              />
              {error?.password && (
                <p className='text-sm text-red-500'>{error.password}</p>
              )}
            </div>
            <Button
              type='submit'
              className='w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold'
            >
              로그인
            </Button>
            <div className='flex justify-between items-center mt-2'>
              <span className='text-sm text-gray-500'>계정이 없으신가요?</span>
              <Button type='button' variant='outline' asChild className='ml-2'>
                <Link href='/signup'>회원가입</Link>
              </Button>
            </div>
          </form>
          <div className='my-4 flex items-center'>
            <div className='flex-grow h-px bg-gray-200' />
            <span className='mx-2 text-gray-400 text-xs'>또는</span>
            <div className='flex-grow h-px bg-gray-200' />
          </div>
          <Button
            type='button'
            variant='outline'
            className='w-full flex items-center justify-center gap-2'
            onClick={() => {
              signIn('google', {
                redirect: true,
                callbackUrl: '/',
              });
            }}
          >
            <FcGoogle className='w-5 h-5' />
            <span className='font-medium'>Google로 로그인</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
