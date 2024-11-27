import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { database } from '@repo/database'
import { StudentProgressDashboard } from '@repo/design-system/components/student-progress-dashboard'

async function getStudentGrades(studentId: string) {
  try {
    console.log('Fetching grades for student:', studentId);
    const grades = await database.grade.findMany({
      where: {
        studentId: studentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    console.log('Fetched grades:', grades);
    return grades
  } catch (error) {
    console.error('Error fetching grades:', error)
    throw error; // Let's throw the error to see it in Vercel logs
  }
}

export default async function ProgressPage() {
  try {
    const { userId } = await auth()
    console.log('[VERCEL] User ID:', userId);
    
    if (!userId) {
      console.log('[VERCEL] No userId found, redirecting to sign-in');
      redirect('/sign-in')
    }

    const student = await database.student.findUnique({
      where: {
        clerkId: userId,
      },
    })
    console.log('[VERCEL] Found student:', JSON.stringify(student, null, 2));

    if (!student) {
      console.log('[VERCEL] No student found for clerkId:', userId);
      return (
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Student Profile Not Found</h1>
          <p>Please contact your administrator.</p>
        </div>
      )
    }

    const grades = await getStudentGrades(student.id)
    console.log('[VERCEL] Grades loaded:', grades.length);

    return (
      <div className="container mx-auto py-6">
        <Suspense fallback={<div>Loading...</div>}>
          <StudentProgressDashboard 
            studentId={student.id}
            grades={grades}
            isLoading={false}
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('[VERCEL] Detailed error in ProgressPage:', {
      error: error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return more detailed error information in development
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Error Loading Progress</h1>
          <pre className="bg-red-50 p-4 rounded">
            {JSON.stringify(error instanceof Error ? error.message : error, null, 2)}
          </pre>
        </div>
      );
    }
    
    return <div>Error loading student progress</div>;
  }
}