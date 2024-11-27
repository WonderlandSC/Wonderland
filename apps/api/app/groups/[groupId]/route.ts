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
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;
    console.log('Received PUT request for group:', groupId);

    const body = await request.json();
    console.log('Request body:', body);

    const { name, description, regularPrice, earlyBirdPrice, earlyBirdDeadline, schedule } = body;

    if (!name || !description) {
      console.log('Validation failed: missing required fields');
      return Response.json(
        { error: 'Name and description are required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedGroup = await database.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
        description,
        regularPrice,
        earlyBirdPrice,
        earlyBirdDeadline: new Date(earlyBirdDeadline),
        schedule,
      },
    });

    console.log('Group updated successfully:', updatedGroup);

    return Response.json({ group: updatedGroup }, { 
      status: 200,
      headers: corsHeaders 
    });
  } catch (error) {
    console.error('Error updating group:', error);
    return Response.json(
      { error: 'Failed to update group', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}