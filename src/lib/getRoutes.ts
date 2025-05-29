import { Home, Info } from 'lucide-react';

export const getRoutes = (pathname: string) => {
  const routes = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      active: pathname === '/',
    },
    {
      href: '/about',
      label: 'About',
      icon: Info,
      active: pathname === '/about',
    },
  ];
  return routes;
};
