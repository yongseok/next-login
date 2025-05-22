'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { loginSchema, LoginForm } from '@/lib/validations/loginSchema';
import { login } from '../actions/auth';
import { startTransition, useActionState, useEffect } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  // 폼 제출 상태 관리
  const [state, formAction] = useActionState(
    login,
    {
      success: false,
      message: '',
      errors: {},
    },
    undefined
  );
  console.log('🚀 | LoginPage | state:', state);
  
  // 폼 유효성 검사
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // 폼 제출 핸들러
  const onSubmit = (values: LoginForm) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    startTransition(() => {
      formAction(formData);
    });
  };

  // 폼 제출 후 상태 처리
  useEffect(() => {
    if (state?.success === false && state?.message) {
      toast.error(state.message);
    } else if (state?.success === true && state?.message) {
      toast.success(state.message);
    }
  }, [state]);

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
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='이메일을 입력하세요'
                        className='bg-gray-50'
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.email?.message ||
                        state?.errors?.email?.[0]}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        placeholder='비밀번호를 입력하세요'
                        className='bg-gray-50'
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.password?.message ||
                        state?.errors?.password?.[0]}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold'
              >
                로그인
              </Button>
              <div className='flex justify-between items-center mt-2'>
                <span className='text-sm text-gray-500'>
                  계정이 없으신가요?
                </span>
                <Button
                  type='button'
                  variant='outline'
                  asChild
                  className='ml-2'
                >
                  <Link href='/signup'>회원가입</Link>
                </Button>
              </div>
            </form>
          </Form>
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
              // TODO: 실제 OAuth 연동 함수 호출
              // 예: signIn('google')
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
