'use client';

import {
  Command,
  Frame,
  Home,
  Images,
  LifeBuoy,
  Map,
  PieChart,
  Send,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useGetGalleries } from '@/lib/swr/useGalleries';
import { useState, useEffect } from 'react';
import { CLIENT_ROUTES } from '@/lib/config/clientRoutes';
import { Gallery } from '@prisma/client';
import { NavAuth } from './nav-auth';
import { NavGallery } from './nav-gallery';
const initialGalleryItems: { title: string; url: string }[] = [
  {
    title: 'Upload',
    url: '/gallery/upload',
  },
  {
    title: 'List',
    url: '/gallery/list',
  },
];
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Gallery',
      url: '/gallery',
      icon: Images,
      isActive: true,
      items: [...initialGalleryItems],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  const user = session?.user;
  const [page, setPage] = useState(1);
  const [navMain, setNavMain] = useState(data.navMain);
  const [isMore, setIsMore] = useState(false);
  const [galleryItems, setGalleryItems] = useState(initialGalleryItems);

  const {
    galleries: fetchedGalleryItems,
    total,
    isLoading: isGalleryItemsLoading,
  } = useGetGalleries(page, 3);

  useEffect(() => {
    if (fetchedGalleryItems?.length > 0) {
      setGalleryItems((prev) => [
        ...prev,
        ...fetchedGalleryItems.map((gallery: Gallery) => ({
          title: gallery.title,
          url: CLIENT_ROUTES.GALLERY.DETAIL(gallery.id),
        })),
      ]);
    }
  }, [fetchedGalleryItems]);

  useEffect(() => {
    setNavMain((prev) => {
      return prev?.map((item) => {
        if (item.title === 'Gallery') {
          return {
            ...item,
            isActive: item.isActive ?? false,
            items: [...(galleryItems ?? [])],
          };
        }
        return item;
      });
    });
  }, [galleryItems]);

  useEffect(() => {
    if (total > galleryItems?.length) {
      setIsMore(true);
    } else {
      setIsMore(false);
    }
  }, [galleryItems, total]);

  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>Acme Inc</span>
                  <span className='truncate text-xs'>Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavAuth />
        <NavGallery items={galleryItems} />
        <NavMain
          items={navMain}
          isLoading={isGalleryItemsLoading}
          isMore={isMore}
          onMore={() => {
            setPage(page + 1);
          }}
        />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || 'Guest',
            email: user?.email || 'guest@example.com',
            avatar: user?.image || '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
