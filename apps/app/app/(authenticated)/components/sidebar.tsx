'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@repo/design-system/components/ui/sidebar';
import { cn } from '@repo/design-system/lib/utils';
import {
  BookOpenIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  GraduationCapIcon,
  LucideIcon,
  PieChartIcon,
  Settings2Icon,
  UsersIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Skeleton } from "@repo/design-system/components/ui/skeleton";

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

type DatabaseStudent = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  teacher: string | null;
};

type NavSubItem = {
  title: string;
  url: string;
  avatar: string;
};

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
};

const data = {
  adminNavSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2Icon,
    },
    {
      title: 'Reports',
      url: '/reports',
      icon: ClipboardListIcon,
    }
  ],
};

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {
  const sidebar = useSidebar();
  const pathname = usePathname();
  const { user } = useUser();
  const [students, setStudents] = useState<DatabaseStudent[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
          credentials: 'include',
        });
        const data = await response.json();
        setStudents(data.students);

        const currentUser = data.students.find((student: DatabaseStudent) => 
          student.id === user?.id
        );
        
        if (currentUser?.role) {
          setCurrentUserRole(currentUser.role);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchStudents();
    }
  }, [user?.id]);

  const SidebarSkeleton = () => (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-[200px]" />
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );

  if (isLoading || currentUserRole === null) {
    return (
      <>
        <Sidebar variant="inset">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <Skeleton className="h-[36px] w-[36px] rounded-full" />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarSkeleton />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </>
    );
  }

  const getNavItems = (): NavItem[] => {
    const adminNav: NavItem[] = [
      {
        title: 'Dashboard',
        url: '/',
        icon: PieChartIcon,
        isActive: pathname === '/',
      },
      {
        title: 'Students',
        url: '/students',
        icon: UsersIcon,
        isActive: pathname.startsWith('/students'),
        items: students
          .filter(student => student.role === 'student')
          .map(student => {
            // Generate a random pastel color for the avatar background
            const hue = Math.random() * 360;
            const backgroundColor = `hsl(${hue}, 70%, 85%)`;
            const initial = (student.firstName[0] || '').toUpperCase();
            
            return {
              title: `${student.firstName} ${student.lastName}`,
              url: `/students/${student.id}`,
              avatar: `data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                  <rect width="40" height="40" fill="${backgroundColor}"/>
                  <text 
                    x="50%" 
                    y="50%" 
                    dy=".1em"
                    fill="#000000" 
                    font-family="Arial" 
                    font-size="20"
                    text-anchor="middle" 
                    dominant-baseline="middle"
                  >${initial}</text>
                </svg>
              `)}`,
            };
          }),
      },
    ];

    const studentNav: NavItem[] = [
      {
        title: 'My Dashboard',
        url: '/',
        icon: PieChartIcon,
        isActive: pathname === '/',
      },
      {
        title: 'My Grades',
        url: '/grades',
        icon: GraduationCapIcon,
        isActive: pathname === '/grades',
      },
    ];

    return currentUserRole === 'teacher' ? adminNav : studentNav;
  };

  const navItems = getNavItems();

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className={cn('h-[36px] overflow-hidden transition-all [&>div]:w-full')}>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'h-[32px] w-[32px]',
                    },
                  }}
                />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {currentUserRole === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard'}
            </SidebarGroupLabel>
            <SidebarMenu>
              {navItems.map((item: NavItem) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
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
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRightIcon />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem: NavSubItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={subItem.url}>
                                    <img 
                                      src={subItem.avatar} 
                                      alt={subItem.title} 
                                      className="w-5 h-5 rounded-full"
                                    />
                                    <span>{subItem.title}</span>
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {currentUserRole === 'teacher' && data.adminNavSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <UserButton
                showName
                appearance={{
                  elements: {
                    rootBox: 'flex overflow-hidden',
                    userButtonBox: 'flex-row-reverse',
                    userButtonOuterIdentifier: 'truncate pl-0',
                  },
                }}
              />
              <ModeToggle />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};