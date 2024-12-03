'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { StudentProgressDashboard } from '@repo/design-system/components/student-progress-dashboard';
import { Separator } from '@repo/design-system/components/ui/separator';
import { Breadcrumb, BreadcrumbPage, BreadcrumbItem, BreadcrumbList } from '@repo/design-system/components/ui/breadcrumb';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';

interface Props {
  userId: string;
  initialRole: string;
}

export function DashboardClient({ userId, initialRole }: Props) {
  const { getToken } = useAuth();
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isTeacher = initialRole === 'teacher'; // Determine if the user is a teacher

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = await getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/students/${userId}/grades`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch grades');
        }

        const data = await response.json();
        setGrades(data.grades || []);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setGrades([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, [userId, getToken]);

  if (isTeacher) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2">
          {/* ... header content ... */}
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
            {/* ... dashboard content ... */}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>My Progress</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="container mx-auto">
          <StudentProgressDashboard grades={grades} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}