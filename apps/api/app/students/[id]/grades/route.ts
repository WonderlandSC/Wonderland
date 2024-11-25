import { NextRequest, NextResponse } from 'next/server';
import { database } from '@repo/database';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://your-production-url.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
} as const;


export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const grades = await database.grade.findMany({
      where: {
        studentId: context.params.id,
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
  context: { params: { id: string } }
) {
  try {
    const { subject, value, description } = await request.json();

    // Validate required fields
    if (!subject || value === undefined) {
      return NextResponse.json(
        { error: 'Subject and value are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify student exists
    const student = await database.student.findUnique({
      where: { id: context.params.id },  // Fixed: using context.params.id
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Create the grade
    const grade = await database.grade.create({
      data: {
        subject,
        value,
        description,
        studentId: context.params.id,  // Fixed: using context.params.id
      },
      include: {
        student: true,
      },
    });

    return NextResponse.json({ grade }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error creating grade:', error);
    return NextResponse.json(
      { error: 'Failed to create grade' },
      { status: 500, headers: corsHeaders }
    );
  }
}