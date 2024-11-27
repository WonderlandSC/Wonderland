import { NextRequest } from 'next/server';
import { database } from '@repo/database';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

export async function GET() {
  try {
    const groups = await database.group.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return Response.json({ groups }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return Response.json({ groups: [] }, { headers: corsHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, regularPrice, earlyBirdPrice, earlyBirdDeadline, schedule } = await request.json();

    if (!name || regularPrice === undefined || earlyBirdPrice === undefined || !earlyBirdDeadline || !schedule) {
      return Response.json(
        { error: 'Name, regularPrice, earlyBirdPrice, earlyBirdDeadline, and schedule are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const group = await database.group.create({
      data: {
        name,
        description,
        regularPrice,
        earlyBirdPrice,
        earlyBirdDeadline: new Date(earlyBirdDeadline),
        schedule,
      },
    });

    return Response.json({ group }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error creating group:', error);
    return Response.json(
      { error: 'Failed to create group' },
      { status: 500, headers: corsHeaders }
    );
  }
}