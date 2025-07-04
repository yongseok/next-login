'use client';

import {
  ChevronRight,
  type LucideIcon,
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
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavMain({
  items,
  isLoading,
  isMore,
  onMore,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  isLoading?: boolean;
  isMore?: boolean;
  onMore?: () => void;
}) {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className='data-[state=open]:rotate-90'>
                      <ChevronRight />
                      <span className='sr-only'>Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className='ml-0 border-l-0 px-1.5'>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton>
                          <a href='#'>Update</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                    <SidebarMenuSub className='ml-0 border-l-0 px-1.5'>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <a href='#'>List</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenuSub>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction>
                        <ChevronRight />
                        <span className='sr-only'>Toggle</span>
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                        {isLoading && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSkeleton />
                          </SidebarMenuSubItem>
                        )}
                        {isMore && (
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton
                              asChild
                              onClick={onMore}
                              className='cursor-pointer'
                            >
                              <span>Load More...</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
