import { Suspense } from 'react';
import StudentClientPage from './StudentClientPage';

interface Props {
  params: {
    id: string;
  }
}

export default async function StudentGradesPage({ params }: Props) {
  const { id } = params;
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Student Grades</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <StudentClientPage studentId={id} />
      </Suspense>
    </div>
  );
}