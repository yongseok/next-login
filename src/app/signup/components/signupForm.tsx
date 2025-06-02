'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UserPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';
import useSignup from '@/lib/hooks/useSignup';

export default function SignupForm() {
  const { isLoading, error, form, signup } = useSignup();
  console.log('🚀 | SignupForm | error:', error);

  // 폼 제출 후 상태 처리
  // useEffect(() => {
  //   if (state?.success === false && state?.message) {
  //     toast.error(state.message);

  //     if (
  //       state.message.includes('이미 존재하는 이메일입니다.') ||
  //       state.message.includes('사용자를 찾을 수 없습니다.')
  //     ) {
  //       form.setFocus('email');
  //       form.setError('email', { message: state.message });
  //     }
  //   } else if (state?.success === true && state?.message) {
  //     toast.success(state.message);
  //     signIn('credentials', {
  //       email: form.getValues('email'),
  //       password: form.getValues('password'),
  //       redirect: true,
  //       redirectTo: '/',
  //     });
  //   }
  // }, [state, form]);

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col items-center gap-2'>
          <div className='bg-primary rounded-full p-3'>
            <UserPlus className='w-8 h-8 text-primary-foreground' />
          </div>
          <CardTitle className='text-2xl font-bold'>회원가입</CardTitle>
          <p className='text-gray-500 text-sm'>새 계정을 만들어보세요</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                signup('credentials', data);
              })}
              className='space-y-4'
            >
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
                      {error?.email &&
                        error.email.map((error) => <p key={error}>{error}</p>)}
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
                      {error?.password &&
                        error.password.map((error) => (
                          <p key={error}>{error}</p>
                        ))}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type='password'
                        placeholder='비밀번호를 다시 입력하세요'
                        className='bg-gray-50'
                      />
                    </FormControl>
                    <FormMessage>
                      {error?.confirmPassword &&
                        error.confirmPassword.map((error) => (
                          <p key={error}>{error}</p>
                        ))}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                회원가입
              </Button>
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
              signIn('google', {
                redirectTo: '/',
              });
            }}
          >
            <FcGoogle className='w-5 h-5' />
            <span className='font-medium'>Google로 회원가입</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
