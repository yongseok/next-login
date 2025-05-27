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
import { useForm } from 'react-hook-form';
import { UserPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signupAction } from '../actions/auth';
import { SignupForm } from '@/lib/validations/signupSchema';
import { startTransition, useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

export default function Register() {
  // 폼 제출 상태 관리
  const [state, formAction] = useActionState(
    signupAction,
    {
      success: false,
      message: '',
      errors: {},
    },
    undefined
  );

  // 폼 유효성 검사
  const form = useForm<SignupForm>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // 폼 제출 후 상태 처리
  useEffect(() => {
    if (state?.success === false && state?.message) {
      toast.error(state.message);
    } else if (state?.success === true && state?.message) {
      toast.success(state.message);
    }
  }, [state]);

  // 폼 제출 핸들러
  const onSubmit = (values: SignupForm) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col items-center gap-2'>
          <div className='bg-indigo-100 rounded-full p-3'>
            <UserPlus className='w-8 h-8 text-indigo-500' />
          </div>
          <CardTitle className='text-2xl font-bold'>회원가입</CardTitle>
          <p className='text-gray-500 text-sm'>새 계정을 만들어보세요</p>
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
                        state?.errors?.email}
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
                        state?.errors?.password}
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
                      {form.formState.errors.confirmPassword?.message ||
                        state?.errors?.confirmPassword}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold'
              >
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
