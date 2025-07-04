'use client';

import { Moon, Sun } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import { usePathname } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import LocaleSwitcher from './LocaleSwitcher';
import { useTheme } from 'next-themes';

function stripLocale(pathname: string) {
  const match = pathname.match(/^\/[a-z]{2}(\/.*)?$/);
  if (!match) return pathname;
  return match[1] || '/';
}
function pathToObject(_path: string) {
  // 로케일 제거
  const localeStripped = stripLocale(_path);

  // '/'만 있을 때는 바로 반환
  if (localeStripped === '/' || localeStripped === '') {
    return [{ href: '/', label: 'home' }];
  }

  // '/'로 split 후 빈 값 제거
  const parts = localeStripped.split('/').filter(Boolean);

  // 첫 번째는 항상 home
  const breadcrumbs = [{ href: '/', label: 'home' }];

  // 누적 경로를 저장
  let currentPath = '';
  for (const part of parts) {
    currentPath += `/${part}`;
    breadcrumbs.push({
      href: currentPath,
      label: part,
    });
  }

  return breadcrumbs;
}

export function AppHeader() {
  const pathname = usePathname();
  const pathObject = pathToObject(pathname);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className='flex h-16 shrink-0 items-center gap-2 justify-between'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mr-2 data-[orientation=vertical]:h-4'
        />
        <Breadcrumb>
          <BreadcrumbList>
            {pathObject.map((item, index) => (
              <Fragment key={item.href}>
                {index > 0 && (
                  <BreadcrumbSeparator className='hidden md:block' />
                )}
                <BreadcrumbItem>
                  {index === pathObject.length - 1 ||
                  pathObject.length === 1 ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href={item.href}
                      className='hidden md:block'
                    >
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='flex items-center gap-2 px-4'>
        <LocaleSwitcher />
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
    </header>
  );
}
