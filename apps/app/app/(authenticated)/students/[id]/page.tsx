import { auth, OrganizationMembership } from '@clerk/nextjs/server';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { notFound } from 'next/navigation';
import { clerkClient } from '@clerk/nextjs/server';
import { getStudentData } from '../utils';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { student } = await getStudentData(params.id);

  return {
    title: `${student.firstName} ${student.lastName} - Wonderland`,
  };
}

const StudentPage = async ({ params }: { params: { id: string } }) => {
  const { student } = await getStudentData(params.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">
          {student.firstName} {student.lastName}
        </h2>
        <div className="flex gap-4">
          <Button>Add Grade</Button>
          <Button variant="outline">Edit Grade</Button>
          <Button variant="destructive">Delete Grade</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No grades yet</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPage;