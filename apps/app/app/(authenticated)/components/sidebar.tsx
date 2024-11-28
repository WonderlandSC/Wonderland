'use client';

import { OrganizationSwitcher, UserButton, useOrganization } from '@clerk/nextjs';
import { OrganizationMembershipRole } from '@clerk/nextjs/server';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
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
  BotIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  FolderIcon,
  FrameIcon,
  GraduationCapIcon,
  LifeBuoyIcon,
  Link,
  LucideIcon,
  MapIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
  ShareIcon,
  SquareTerminalIcon,
  Trash2Icon,
  UsersIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

type GlobalSidebarProperties = {
  readonly children: ReactNode;
  readonly userRole?: OrganizationMembershipRole;
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
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminalIcon,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: BotIcon,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpenIcon,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2Icon,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoyIcon,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: SendIcon,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: FrameIcon,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChartIcon,
    },
    {
      name: 'Travel',
      url: '#',
      icon: MapIcon,
    },
  ],
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



export const GlobalSidebar = ({ children, userRole }: GlobalSidebarProperties) => {
  const sidebar = useSidebar();
  const { organization } = useOrganization();
  const [orgMembers, setOrgMembers] = React.useState<any[]>([]);
  const pathname = usePathname(); // Move the hook inside the component

  const getNavItems = (role?: OrganizationMembershipRole, orgMembers: any[] = []): NavItem[] => {
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
    items: orgMembers
      .filter(member => member.role !== 'org:admin')
      .map(member => ({
        avatar: member.publicUserData.imageUrl,
        title: `${member.publicUserData.firstName} ${member.publicUserData.lastName}`,
        url: `/students/${member.id}`,
      })),
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

    return role === 'org:admin' ? adminNav : studentNav;
  };

  const navItems = getNavItems(userRole, orgMembers);
  
React.useEffect(() => {
  const fetchOrgMembers = async () => {
    if (organization) {
      try {
        const members = await organization.getMemberships();
        console.log('Organization members:', members.data); // Add this log
        setOrgMembers(members.data);
      } catch (error) {
        console.error('Failed to fetch organization members', error);
      }
    }
  };

  fetchOrgMembers();
}, [organization]);
  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className={cn(
                  'h-[36px] overflow-hidden transition-all [&>div]:w-full',
                  sidebar.open ? '' : '-mx-1'
                )}
              >
                <OrganizationSwitcher
                  hidePersonal
                  afterSelectOrganizationUrl="/"
                />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              {userRole === 'org:admin' ? 'Teacher Dashboard' : 'Student Dashboard'}
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
                                    <Image className='rounded-full' src={subItem.avatar} alt={subItem.title} width={20} height={20} />
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
          {/* <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarMenu>
              {data.projects.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontalIcon />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side="bottom"
                      align="end"
                    >
                      <DropdownMenuItem>
                        <FolderIcon className="text-muted-foreground" />
                        <span>View Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShareIcon className="text-muted-foreground" />
                        <span>Share Project</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Trash2Icon className="text-muted-foreground" />
                        <span>Delete Project</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MoreHorizontalIcon />
                  <span>More</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup> */}
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Show admin secondary nav only for teachers */}
                {userRole === 'org:admin' && data.adminNavSecondary.map((item) => (
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
