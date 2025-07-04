import { Home, Info, Image } from 'lucide-react';

/**
 * 다국어 처리를 위해 로케일을 제거한 패스네임을 반환합니다.
 *
 * @example
 * /ko/gallery/upload -> /gallery/upload
 * /en/gallery/upload -> /gallery/upload
 * /ko/gallery -> /gallery
 * /en/gallery -> /gallery
 */
function stripLocale(pathname: string) {
  const match = pathname.match(/^\/[a-z]{2}(\/.*)?$/);
  if (!match) return pathname;
  return match[1] || '/';
}

export const getRoutes = (pathname: string, t: (key: string) => string, locale?: string) => {
  const cleanPath = stripLocale(pathname);

  const routes = [
    {
      title: t('home'),
      url: locale ? `/${locale}` : '/',
      icon: Home,
      active: cleanPath === '/',
    },
    {
      title: t('gallery'),
      url: locale ? `/${locale}/gallery` : '/gallery',
      icon: Image,
      active: cleanPath === '/gallery',
      subRoutes: [
        {
          title: t('gallery_list'),
          url: locale ? `/${locale}/gallery` : '/gallery',
          icon: Image,
        },
        {
          title: t('gallery_upload'),
          url: locale ? `/${locale}/gallery/upload` : '/gallery/upload',
          icon: Image,
        },
      ],
    },
    {
      title: t('about'),
      url: locale ? `/${locale}/about` : '/about',
      icon: Info,
      active: cleanPath === '/about',
    },
  ];
  return routes;
};
