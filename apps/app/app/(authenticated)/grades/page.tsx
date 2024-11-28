import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import StudentGradesView from './StudentGradesView';
import { database } from '@repo/database';

export default async function StudentGradesPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const student = await database.student.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (!student) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Student Profile Not Found</h1>
        <p>Please contact your administrator.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">My Grades</h1>
        <StudentGradesView studentId={student.id} />
    </div>
  );
}