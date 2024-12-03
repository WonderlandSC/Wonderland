import { database } from '@repo/database';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { StudentProgressDashboard } from './student-dashboard';
import { ErrorBoundary } from '@repo/design-system/components/ui/error-boundary';
import { TeacherDashboard } from './teacher-dashboard';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/sign-in');
    }

        // Get the user from Clerk to check role
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    const role = clerkUser.publicMetadata.role as string;

    const user = await database.student.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      return (
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Error</h1>
          <p>Account Not Found</p>
        </div>
      );
    }

    return (
      <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
        {role === 'teacher' ? (
          <TeacherDashboard userId={user.id} />
        ) : (
          <StudentProgressDashboard userId={user.id} />
        )}
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('[ERROR] Dashboard page error:', error);
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Error</h1>
        <p>Something went wrong. Please try again later.</p>
      </div>
    );
  }
}