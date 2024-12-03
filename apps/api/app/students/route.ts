import { NextRequest } from 'next/server';
import { database } from '@repo/database';
import { corsHeaders, handleCors } from '../../lib/cors';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    const students = await database.student.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        teacher: true,
        groupId: true,
        group: true,
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