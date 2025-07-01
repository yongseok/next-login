'use client';
import { getRoutes } from '@/lib/getRoutes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { UserSheet } from './UserSheet';
import { Button } from './ui/button';
import { LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';
import LocaleSwitcher from './LocaleSwitcher';
import { useTranslations } from 'next-intl';

export function MainNavigation() {
  const { status } = useSession();
  const pathname = usePathname();
  const t = useTranslations('mainNavigation');
  const routes = useMemo(() => getRoutes(pathname, t), [pathname, t]);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className='flex items-center gap-4 justify-between px-4 sm:px-6 mx-auto max-w-7xl w-full'>
      <div className='flex items-center gap-4'>
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={
              route.href === pathname
                ? 'font-bold underline-offset-4 underline'
                : ''
            }
          >
            {route.label}
          </Link>
        ))}
      </div>
      <div className='flex items-center gap-4'>
        {status === 'unauthenticated' ? (
          <Button variant='ghost' size='icon' asChild>
            <Link href='/api/auth/signin'>
              <LogIn />
            </Link>
          </Button>
        ) : (
          <Button variant='ghost' size='icon' asChild>
            <Link href='/api/auth/signout'>
              <LogOut />
            </Link>
          </Button>
        )}
        <LocaleSwitcher />
        <UserSheet />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {mounted ? (
            theme === 'dark' ? (
              <Sun className='w-4 h-4' />
            ) : (
              <Moon className='w-4 h-4' />
            )
          ) : null}
        </Button>
      </div>
    </nav>
  );
}
