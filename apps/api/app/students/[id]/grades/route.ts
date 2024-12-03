import { NextRequest } from 'next/server';
import { database } from '@repo/database';
import { auth } from '@clerk/nextjs/server';
import { corsHeaders, handleCors } from '../../../../lib/cors';

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
      return handleCors(Response.json({ error: 'Unauthorized' }, { status: 401 }));
    }

    const { id } = await params;

    const requestingUser = await database.student.findUnique({
      where: { id: userId },
    });

    if (!requestingUser) {
      return handleCors(Response.json({ error: 'User not found' }, { status: 404 }));
    }

    if (requestingUser.role !== 'teacher' && userId !== id) {
      return handleCors(Response.json({ error: 'Unauthorized' }, { status: 403 }));
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

    return handleCors(Response.json({ grades }));
  } catch (error) {
    console.error('Error fetching grades:', error);
    return handleCors(Response.json({ grades: [] }));
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { subject, value, description } = await request.json();

    if (!subject || value === undefined) {
      return handleCors(Response.json(
        { error: 'Subject and value are required' },
        { status: 400 }
      ));
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

    return handleCors(Response.json({ grade }));
  } catch (error) {
    console.error('Error creating grade:', error);
    return handleCors(Response.json(
      { error: 'Failed to create grade' },
      { status: 500 }
    ));
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id } = await params;
    const { gradeIds } = await request.json();

    await database.grade.deleteMany({
      where: {
        id: { in: gradeIds },
        studentId: id,
      },
    });

    return handleCors(Response.json({ success: true }));
  } catch (error) {
    console.error('Error deleting grades:', error);
    return handleCors(Response.json(
      { error: 'Failed to delete grades' },
      { status: 500 }
    ));
  }
}