import { NextRequest } from 'next/server';
import { database } from '@repo/database';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
} as const;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; gradeId: string } }
) {
  try {
    const { id, gradeId } = params;
    console.log('Received PUT request for student:', id, 'grade:', gradeId);

    const body = await request.json();
    console.log('Request body:', body);

    const { subject, value, description } = body;

    if (!subject || value === undefined) {
      console.log('Validation failed: missing subject or value');
      return Response.json(
        { error: 'Subject and value are required' },
        { status: 400, headers: corsHeaders }
      );
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

    return Response.json({ grade: updatedGrade }, { 
      status: 200,
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error updating grade:', error);
    return Response.json(
      { error: 'Failed to update grade', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}