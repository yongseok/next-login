import { Home, Info } from 'lucide-react';

export const getRoutes = (pathname: string, t: (key: string) => string) => {
  const routes = [
    {
      href: '/',
      label: t('home'),
      icon: Home,
      active: pathname === '/',
    },
    {
      href: '/about',
      label: t('about'),
      icon: Info,
      active: pathname === '/about',
    },
  ];
  return routes;
};
