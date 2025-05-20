import { Home, Info, LogIn } from 'lucide-react';

export const getRoutes = (pathname: string) => {
  const routes = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      active: pathname === '/',
    },
    {
      href: '/login',
      label: 'Login',
      icon: LogIn,
      active: pathname === '/login',
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
