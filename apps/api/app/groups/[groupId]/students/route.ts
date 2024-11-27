import { NextRequest } from 'next/server';
import { database } from '@repo/database';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, credentials',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
} as const;

// Make sure the OPTIONS handler includes these headers
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

    return Response.json({ students }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching students:', error);
    return Response.json(
      { error: 'Failed to fetch students' }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;
    const body = await request.json();
    const { studentIds } = body;

    console.log('Received groupId:', groupId); // Debug log
    console.log('Received studentIds:', studentIds); // Debug log

    if (!studentIds || !Array.isArray(studentIds)) {
      return Response.json(
        { error: 'Student IDs are required and must be an array' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Update multiple students
    const updatePromises = studentIds.map(studentId =>
      database.student.update({
        where: { 
          id: studentId
        },
        data: { 
          groupId: groupId 
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      })
    );

    const addedStudents = await Promise.all(updatePromises);
    console.log('Added students:', addedStudents); // Debug log

    return Response.json(
      { addedStudents }, 
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error adding students to group:', error);
    return Response.json(
      { error: 'Failed to add students to group', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { groupId: string } }
) {
  try {
    const { groupId } = params;
    const { studentIds } = await request.json();

    if (!studentIds || !Array.isArray(studentIds)) {
      return Response.json(
        { error: 'Student IDs are required and must be an array' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Update multiple students
    const updatePromises = studentIds.map(studentId =>
      database.student.update({
        where: { 
          id: studentId,
          groupId: groupId, // Ensure student is in this group
        },
        data: { 
          groupId: null 
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      })
    );

    const removedStudents = await Promise.all(updatePromises);
    console.log('Removed students:', removedStudents); // Debug log

    return Response.json(
      { removedStudents }, 
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error removing students from group:', error);
    return Response.json(
      { error: 'Failed to remove students from group', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}