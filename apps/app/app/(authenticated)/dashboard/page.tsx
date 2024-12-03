import { database } from '@repo/database';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const user = await database.student.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Account Not Found</h1>
        <p>Your account hasn't been synchronized with the system yet. Please contact your teacher or administrator.</p>
      </div>
    );
  }

  return <DashboardClient userId={user.id} initialRole={user.role} />;
}