import { NextRequest } from 'next/server';
import { database } from '@repo/database';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE',
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const grades = await database.grade.findMany({
      where: {
        studentId: id,
      },
      include: {
        student: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json({ grades }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching grades:', error);
    return Response.json({ grades: [] }, { headers: corsHeaders });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { subject, value, description } = await request.json();

    if (!subject || value === undefined) {
      return Response.json(
        { error: 'Subject and value are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const student = await database.student.findUnique({
      where: { id },
    });

    if (!student) {
      return Response.json(
        { error: 'Student not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    const grade = await database.grade.create({
      data: {
        subject,
        value,
        description,
        studentId: id,
      },
      include: {
        student: true,
      },
    });

    return Response.json({ grade }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error creating grade:', error);
    return Response.json(
      { error: 'Failed to create grade' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { gradeIds } = await request.json();

    if (!gradeIds || !Array.isArray(gradeIds)) {
      return Response.json(
        { error: 'Grade IDs are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    await database.grade.deleteMany({
      where: {
        id: { in: gradeIds },
        studentId: id, // Ensure grades belong to the student
      },
    });

    return Response.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting grades:', error);
    return Response.json(
      { error: 'Failed to delete grades' },
      { status: 500, headers: corsHeaders }
    );
  }
}