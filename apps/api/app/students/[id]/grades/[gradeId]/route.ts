import { NextRequest } from 'next/server';
import { database } from '@repo/database';
import { auth } from '@clerk/nextjs/server';
import { corsHeaders, handleCors } from '../../../../../lib/cors';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; gradeId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return handleCors(Response.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    const teacher = await database.student.findUnique({
      where: { id: userId },
    });

    if (!teacher || teacher.role !== 'teacher') {
      return handleCors(Response.json({ error: 'Unauthorized' }, { status: 403 }));
    }

    const { id, gradeId } = await params;
    console.log('Received PUT request for student:', id, 'grade:', gradeId);

    const body = await request.json();
    console.log('Request body:', body);

    const { subject, value, description } = body;

    if (!subject || value === undefined) {
      console.log('Validation failed: missing subject or value');
      return handleCors(Response.json(
        { error: 'Subject and value are required' },
        { status: 400 }
      ));
    }

    const updatedGrade = await database.grade.update({
      where: {
        id: gradeId,
        studentId: id,
      },
      data: {
        subject,
        value,
        description,
      },
    });

    console.log('Grade updated successfully:', updatedGrade);

    return handleCors(Response.json({ grade: updatedGrade }));
  } catch (error) {
    console.error('Error updating grade:', error);
    return handleCors(Response.json(
      { error: 'Failed to update grade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    ));
  }
}