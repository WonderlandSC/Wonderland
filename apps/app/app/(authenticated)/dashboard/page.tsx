import { database } from '@repo/database';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';
import { ErrorBoundary } from '@repo/design-system/components/ui/error-boundary';

export default async function Dashboard() {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect('/sign-in');
    }

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
        <DashboardClient userId={user.id} initialRole={user.role} />
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