'use client';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { Button } from './ui/button';
import { Loader2, LogIn } from 'lucide-react';
import { Session } from 'next-auth';
import { useTranslations } from 'next-intl';

export default function LoginButton({
  provider,
  isLoading,
  onClick,
  session,
  ...props
}: {
  provider: 'google' | 'github' | 'credentials';
  isLoading: boolean;
  onClick?: () => void;
  session: Session | null;
} & React.ComponentProps<'button'>) {
  const t = useTranslations('login');
  return (
    <Button
      type='button'
      variant='outline'
      disabled={isLoading}
      className='w-full flex items-center justify-center gap-2'
      onClick={onClick}
      {...props}
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
        {t('withLogin', {
          provider:
            provider === 'google'
              ? 'Google'
              : provider === 'github'
              ? 'GitHub'
              : 'Email',
          login: session ? t('logout') : t('login'),
        })}
      </span>
    </Button>
  );
}
