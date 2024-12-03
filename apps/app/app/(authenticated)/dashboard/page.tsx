import { database } from '@repo/database';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/design-system/components/ui/breadcrumb';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { StudentProgressDashboard } from '@repo/design-system/components/student-progress-dashboard';
import { Suspense } from 'react';

// Add these two lines to mark the route as dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Dashboard = async () => {
  try {
    const { userId } = await auth();
    console.log('[DEBUG] userId:', userId);

    if (!userId) {
      redirect('/sign-in');
      return null;
    }

    const user = await database.student.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.log('[DEBUG] No user found');
      return (
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Account Not Found</h1>
          <p>Your account hasn't been synchronized with the system yet. Please contact your teacher or administrator.</p>
        </div>
      );
    }

    console.log('[DEBUG] user:', {
      id: user.id,
      role: user.role,
    });

    const isTeacher = user.role === 'teacher';
    console.log('[DEBUG] isTeacher:', isTeacher);

    if (isTeacher) {
      console.log('[DEBUG] Rendering teacher dashboard');
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
            <StudentProgressDashboard 
              studentId={user.id}
              isLoading={false}
              grades={[]}
            />
          </div>
        </div>
      </>
    );

  } catch (error) {
    console.error('[VERCEL] Error in dashboard page:', error);
    return <div>Error loading dashboard</div>;
  }
}

export default Dashboard;