'use client';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from './ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';

export default function LoginButton({
  provider,
  redirectTo = '/',
}: {
  provider: 'google' | 'github' | 'credentials';
  redirect: boolean;
  redirectTo: string;
}) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      type='button'
      variant='outline'
      disabled={isLoading}
      className='w-sm flex items-center justify-center gap-2'
      onClick={async () => {
        if (!session) {
          setIsLoading(true);
          try {
            await signIn(provider, {
              redirect: true,
              callbackUrl: redirectTo,
            });
          } catch (error) {
            console.error('Login error:', error);
            setIsLoading(false);
          }
        } else {
          signOut();
        }
      }}
    >
      {isLoading ? (
        <Loader2 className='w-5 h-5 animate-spin' />
      ) : (
        <>
          {provider === 'google' && <FcGoogle className='w-5 h-5' />}
          {provider === 'github' && <FaGithub className='w-5 h-5' />}
          {provider === 'credentials' && <LogIn className='w-5 h-5' />}
          <span className='font-medium'>
            {provider}로 {session ? '로그아웃' : '로그인'}
          </span>
        </>
      )}
    </Button>
  );
}
