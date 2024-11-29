import { Suspense } from 'react';
import StudentClientPage from './StudentClientPage';
import { getStudentData } from '../utils';
import StudentLoading from './loading';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function StudentGradesPage({ params }: Props) {
  const id = (await params).id;
  const { student } = await getStudentData(id);
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{student?.firstName} {student?.lastName}</h1>
      <Suspense fallback={<StudentLoading />}>
        <StudentClientPage studentId={id} />
      </Suspense>
    </div>
  );
}