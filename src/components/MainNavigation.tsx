'use client';
import { getRoutes } from '@/lib/getRoutes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { UserSheet } from './UserSheet';
import { Button } from './ui/button';
import { LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession } from 'next-auth/react';

export function MainNavigation() {
  const { status } = useSession();
  const pathname = usePathname();
  const routes = useMemo(() => getRoutes(pathname), [pathname]);
  const { theme, setTheme } = useTheme();
  return (
    <nav className='flex items-center gap-4 justify-between'>
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
        <UserSheet />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <Sun className='w-4 h-4' />
          ) : (
            <Moon className='w-4 h-4' />
          )}
        </Button>
      </div>
    </nav>
  );
}
