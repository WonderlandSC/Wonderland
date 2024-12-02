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
import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { StudentProgressDashboard } from '@repo/design-system/components/student-progress-dashboard';
import { Suspense } from 'react';
import { getCurrentUserMembership } from '../students/utils'

const Dashboard = async () => {
  try {
    const { userId } = await auth();
    console.log('[DEBUG] userId:', userId);

    if (!userId) {
      redirect('/sign-in');
      return null;
    }

    const userMembership = await getCurrentUserMembership();
    if (!userMembership) {
      console.log('[DEBUG] No user membership found');
      return (
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">No Membership</h1>
          <p>You are not associated with any organization. Please contact support.</p>
        </div>
      );
    }

    console.log('[DEBUG] userMembership:', {
      id: userMembership.id,
      role: userMembership.role,
      userId: userMembership.publicUserData?.userId,
    });

    const isTeacher = userMembership.role === 'org:admin';
    console.log('[DEBUG] isTeacher:', isTeacher, 'role:', userMembership.role);

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

    console.log('[DEBUG] Not a teacher, checking for student record');
    const student = await database.student.findUnique({
      where: {
        clerkId: userId,
      },
    });
    console.log('[DEBUG] Student record:', student);

    if (!student) {
      return (
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Account Not Synchronized</h1>
          <p>Your account hasn't been synchronized with the system yet. Please contact your teacher or administrator.</p>
        </div>
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
              studentId={student.id}
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