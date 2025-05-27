'use client';
import { getRoutes } from '@/lib/getRoutes';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { UserSheet } from './UserSheet';

export function MainNavigation() {
  const pathname = usePathname();
  const routes = useMemo(() => getRoutes(pathname), [pathname]);
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
        <div className='flex md:hidden items-center gap-4'>
          <div>모바일 메뉴</div>
        </div>
      </div>
    </nav>
  );
}
