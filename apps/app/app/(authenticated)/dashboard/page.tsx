import { Suspense } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { database } from '@repo/database'
import { StudentProgressDashboard } from '@repo/design-system/components/student-progress-dashboard'

async function getStudentGrades(studentId: string) {
  try {
    const grades = await database.grade.findMany({
      where: {
        studentId: studentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return grades
  } catch (error) {
    console.error('Error fetching grades:', error)
    return []
  }
}

export default async function ProgressPage() {
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

  const grades = await getStudentGrades(student.id)

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
}

