import { NextRequest } from 'next/server';
import { database } from '@repo/database';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeGroup = searchParams.get('excludeGroup');

    let students;

    if (excludeGroup) {
      students = await database.student.findMany({
        where: {
          OR: [
            { groupId: null },
            { groupId: { not: excludeGroup } }
          ]
        },
        select: {
          id: true, // This should be returning the orgmem ID
          firstName: true,
          lastName: true,
        },
      });
    } else {
      students = await database.student.findMany({
        select: {
          id: true, // This should be returning the orgmem ID
          firstName: true,
          lastName: true,
        },
      });
    }

    console.log('Fetched students:', students); // Debug log
    return Response.json({ students }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching students:', error);
    return Response.json(
      { error: 'Failed to fetch students' },
      { status: 500, headers: corsHeaders }
    );
  }
}