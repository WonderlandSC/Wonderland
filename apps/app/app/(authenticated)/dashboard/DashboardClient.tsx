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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setError(null);
        const token = await getToken();
        console.log('[DEBUG] Fetching grades for userId:', userId);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/students/${userId}/grades`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          console.error('[ERROR] Failed to fetch grades:', response.status, response.statusText);
          const errorData = await response.text();
          console.error('[ERROR] Error response:', errorData);
          throw new Error(`Failed to fetch grades: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[DEBUG] Grades data:', data);
        setGrades(data.grades || []);
      } catch (error) {
        console.error('[ERROR] Error fetching grades:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch grades');
        setGrades([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGrades();
  }, [userId, getToken]);

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const isTeacher = initialRole === 'teacher';

  if (isTeacher) {
    return (
      <>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Teacher Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
            {/* Add teacher-specific content here */}
            <p>Welcome to the teacher dashboard!</p>
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