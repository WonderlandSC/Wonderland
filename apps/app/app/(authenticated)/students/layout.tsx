import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@repo/design-system/components/ui/breadcrumb';
import type { ReactNode } from 'react';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { Separator } from '@repo/design-system/components/ui/separator';

type StudentsLayoutProperties = {
  readonly children: ReactNode;
};

const StudentsLayout = ({ children }: StudentsLayoutProperties) => {
  
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/students">Students</BreadcrumbLink>
              </BreadcrumbItem>

            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {children}
      </div>
    </>
  );
};

export default StudentsLayout;