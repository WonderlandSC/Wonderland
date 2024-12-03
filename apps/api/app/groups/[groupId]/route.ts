import { NextRequest } from 'next/server';
import { database } from '@repo/database';
import { corsHeaders, handleCors } from '../../../lib/cors';

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
      return handleCors(Response.json(
        { error: 'Name and description are required' },
        { status: 400 }
      ));
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

    return handleCors(Response.json({ group: updatedGroup }));
  } catch (error) {
    console.error('Error updating group:', error);
    return handleCors(Response.json(
      { error: 'Failed to update group', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    ));
  }
}