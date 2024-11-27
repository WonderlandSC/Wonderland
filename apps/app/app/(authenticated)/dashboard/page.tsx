import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { database } from '@repo/database'
import { StudentProgressDashboard } from '@repo/design-system/components/student-progress-dashboard'

export default async function ProgressPage() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      redirect('/sign-in')
    }

    const student = await database.student.findUnique({
      where: {
        clerkId: userId,
      },
    })

    if (!student) {
      return (
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Student Profile Not Found</h1>
          <p>Please contact your administrator.</p>
        </div>
      )
    }

    return (
      <div className="container mx-auto py-6">
        <Suspense fallback={<div>Loading...</div>}>
          <StudentProgressDashboard 
            studentId={student.id}
            isLoading={false}
            grades={[]} // Initial empty array, data will be fetched client-side
          />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error('[VERCEL] Detailed error in ProgressPage:', error);
    return <div>Error loading student progress</div>;
  }
}