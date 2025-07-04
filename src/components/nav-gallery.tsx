'use client';

import {
  ChevronRight,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useSidebar } from './ui/sidebar';

export function NavGallery({
}: {
  items: {
    title: string;
    url: string;
  }[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>
        <Link href='/gallery'>Gallery</Link>
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href='/gallery/upload'>Upload</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <Collapsible defaultOpen className='group/collapsible'>
          <CollapsibleTrigger className='w-full'>
            <SidebarMenuButton>
              List{' '}
              <ChevronRight className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenu>
              <SidebarMenuItem className='mx-2 border-l-2 pl-2'>
                <SidebarMenuSubButton asChild>
                  <Link href='/gallery'>List 1</Link>
                </SidebarMenuSubButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className='sr-only'>More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-48'
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem>
                      <Pencil className='text-muted-foreground' />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className='text-muted-foreground' />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
              <SidebarMenuItem className='mx-2 border-l-2 pl-2'>
                <SidebarMenuSubButton asChild>
                  <Link href='/gallery'>List 2</Link>
                </SidebarMenuSubButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className='sr-only'>More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className='w-48'
                    side={isMobile ? 'bottom' : 'right'}
                    align={isMobile ? 'end' : 'start'}
                  >
                    <DropdownMenuItem>
                      <Pencil className='text-muted-foreground' />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Trash2 className='text-muted-foreground' />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
