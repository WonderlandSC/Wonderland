import { database } from '@repo/database';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';
import { ErrorBoundary } from '@repo/design-system/components/ui/error-boundary';

export async function getServerSideProps() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false,
        },
      };
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
      return {
        props: {
          error: 'Account Not Found',
        },
      };
    }

    return {
      props: {
        userId: user.id,
        initialRole: user.role,
      },
    };
  } catch (error) {
    console.error('[ERROR] Dashboard page error:', error);
    return {
      props: {
        error: 'Something went wrong. Please try again later.',
      },
    };
  }
}

export default function Dashboard({ userId, initialRole, error }: { userId: string, initialRole: string, error: string }) {
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
      <DashboardClient userId={userId} initialRole={initialRole} />
    </ErrorBoundary>
  );
}