'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { UserPlus } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import useSignup from '@/lib/hooks/useSignup';
import AuthFields from '@/components/AuthFields';
import { useTranslations } from 'next-intl';

export default function SignupForm() {
  const t = useTranslations('signup');
  const { isLoading, error, form, signup } = useSignup();

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='flex flex-col items-center gap-2'>
          <div className='bg-primary rounded-full p-3'>
            <UserPlus className='w-8 h-8 text-primary-foreground' />
          </div>
          <CardTitle className='text-2xl font-bold'>{t('title')}</CardTitle>
          <p className='text-gray-500 text-sm'>{t('subtitle')}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                signup('credentials', data);
              })}
              className='space-y-4'
            >
              <AuthFields
                form={form}
                errors={error}
                extraFields={[
                  {
                    name: 'confirmPassword',
                    label: t('confirmPassword'),
                    placeholder: t('confirmPassword'),
                    type: 'password',
                  },
                ]}
              />
              <Button type='submit' className='w-full' disabled={isLoading}>
                {t('submit')}
              </Button>
            </form>
          </Form>
          <div className='my-4 flex items-center'>
            <div className='flex-grow h-px bg-gray-200' />
            <span className='mx-2 text-gray-400 text-xs'>{t('or')}</span>
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
            disabled={isLoading}
          >
            <FcGoogle className='w-5 h-5' />
            <span className='font-medium'>{t('googleSignup')}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
