import { NextRequest } from 'next/server';
import { database } from '@repo/database';
import { corsHeaders, handleCors } from '../../lib/cors';

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

    return handleCors(Response.json({ groups }));
  } catch (error) {
    console.error('Error fetching groups:', error);
    return handleCors(Response.json({ groups: [] }));
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, regularPrice, earlyBirdPrice, earlyBirdDeadline, schedule } = await request.json();

    if (!name || regularPrice === undefined || earlyBirdPrice === undefined || !earlyBirdDeadline || !schedule) {
      return handleCors(Response.json(
        { error: 'Name, regularPrice, earlyBirdPrice, earlyBirdDeadline, and schedule are required' },
        { status: 400 }
      ));
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

    return handleCors(Response.json({ group }));
  } catch (error) {
    console.error('Error creating group:', error);
    return handleCors(Response.json(
      { error: 'Failed to create group' },
      { status: 500 }
    ));
  }
}