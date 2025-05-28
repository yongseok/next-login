'use client';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from './ui/button';
import { Loader2, LogIn } from 'lucide-react';
import { Session } from 'next-auth';

export default function LoginButton({
  provider,
  isLoading,
  onClick,
  session,
}: {
  provider: 'google' | 'github' | 'credentials';
  isLoading: boolean;
  onClick: () => void;
  session: Session | null;
}) {
  return (
    <Button
      type='button'
      variant='outline'
      disabled={isLoading}
      className='w-full flex items-center justify-center gap-2'
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className='w-5 h-5 animate-spin' />
      ) : (
        <>
          {provider === 'google' && <FcGoogle className='w-5 h-5' />}
          {provider === 'github' && <FaGithub className='w-5 h-5' />}
          {provider === 'credentials' && <LogIn className='w-5 h-5' />}
        </>
      )}
      <span className='font-medium'>
        {provider}로 {session ? '로그아웃' : '로그인'}
      </span>
    </Button>
  );
}
