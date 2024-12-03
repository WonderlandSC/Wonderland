import { NextRequest } from 'next/server';
import { database } from '@repo/database';
import { corsHeaders, handleCors } from '../../../../lib/cors';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    
    const students = await database.student.findMany({
      where: {
        groupId: groupId,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return handleCors(Response.json({ students }));
  } catch (error) {
    console.error('Error fetching students:', error);
    return handleCors(Response.json(
      { error: 'Failed to fetch students' }, 
      { status: 500 }
    ));
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    const body = await request.json();
    const { studentIds } = body;

    if (!studentIds || !Array.isArray(studentIds)) {
      return handleCors(Response.json(
        { error: 'Student IDs are required and must be an array' },
        { status: 400 }
      ));
    }

    const updatePromises = studentIds.map(studentId =>
      database.student.update({
        where: { id: studentId },
        data: { groupId: groupId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      })
    );

    const addedStudents = await Promise.all(updatePromises);

    return handleCors(Response.json({ addedStudents }));
  } catch (error) {
    console.error('Error adding students to group:', error);
    return handleCors(Response.json(
      { error: 'Failed to add students to group', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    ));
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    const { studentIds } = await request.json();

    if (!studentIds || !Array.isArray(studentIds)) {
      return handleCors(Response.json(
        { error: 'Student IDs are required and must be an array' },
        { status: 400 }
      ));
    }

    const updatePromises = studentIds.map(studentId =>
      database.student.update({
        where: { 
          id: studentId,
          groupId: groupId,
        },
        data: { groupId: null },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      })
    );

    const removedStudents = await Promise.all(updatePromises);

    return handleCors(Response.json({ removedStudents }));
  } catch (error) {
    console.error('Error removing students from group:', error);
    return handleCors(Response.json(
      { error: 'Failed to remove students from group', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    ));
  }
}