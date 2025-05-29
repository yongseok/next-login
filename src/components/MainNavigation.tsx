'use client';
import { getRoutes } from '@/lib/getRoutes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { UserSheet } from './UserSheet';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function MainNavigation() {
  const pathname = usePathname();
  const routes = useMemo(() => getRoutes(pathname), [pathname]);
  const { theme, setTheme } = useTheme();
  return (
    <nav className='flex items-center gap-4 justify-between'>
      <div className='flex items-center gap-4'>
        {routes.map((route) => (
          <Link key={route.href} href={route.href}>
            {route.label}
          </Link>
        ))}
      </div>
      <div className='flex items-center gap-4'>
        <UserSheet />
        <Button variant='ghost' size='icon' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
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
