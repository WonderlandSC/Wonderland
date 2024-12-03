import { NextRequest } from 'next/server';
import { database } from '@repo/database';
import { auth } from '@clerk/nextjs/server';

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
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    const { id } = await params;

    // Check if the requesting user is a teacher or the student themselves
    const requestingUser = await database.student.findUnique({
      where: { id: userId },
    });

    if (!requestingUser) {
      return Response.json({ error: 'User not found' }, { status: 404, headers: corsHeaders });
    }

    // Only allow access if user is a teacher or accessing their own grades
    if (requestingUser.role !== 'teacher' && userId !== id) {
      return Response.json({ error: 'Unauthorized' }, { status: 403, headers: corsHeaders });
    }

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
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    // Check if the user is a teacher
    const teacher = await database.student.findUnique({
      where: { id: userId },
    });

    if (!teacher || teacher.role !== 'teacher') {
      return Response.json({ error: 'Unauthorized' }, { status: 403, headers: corsHeaders });
    }

    const { id } = await params;
    const { subject, value, description } = await request.json();

    if (!subject || value === undefined) {
      return Response.json(
        { error: 'Subject and value are required' },
        { status: 400, headers: corsHeaders }
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
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    // Check if the user is a teacher
    const teacher = await database.student.findUnique({
      where: { id: userId },
    });

    if (!teacher || teacher.role !== 'teacher') {
      return Response.json({ error: 'Unauthorized' }, { status: 403, headers: corsHeaders });
    }

    const { id } = await params;
    const { gradeIds } = await request.json();

    await database.grade.deleteMany({
      where: {
        id: { in: gradeIds },
        studentId: id,
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