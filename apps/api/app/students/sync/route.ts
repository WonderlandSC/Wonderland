import { NextRequest, NextResponse } from 'next/server';
import { database } from '@repo/database';
import { auth, clerkClient } from '@clerk/nextjs/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
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

export async function POST(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all users from Clerk
    const clerk = await clerkClient();
    const { data: users } = await clerk.users.getUserList();
    
    // Sync each user to the database
    for (const user of users) {
      await database.student.upsert({
        where: { id: user.id },
        update: {
          firstName: user.firstName || 'Unknown',
          lastName: user.lastName || 'Unknown',
          email: user.emailAddresses[0]?.emailAddress || '',
        },
        create: {
          id: user.id,
          firstName: user.firstName || 'Unknown',
          lastName: user.lastName || 'Unknown',
          email: user.emailAddresses[0]?.emailAddress || '',
          role: 'student', // default role
        },
      });
    }

    return NextResponse.json({ 
      success: true,
      syncedCount: users.length 
    }, { 
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}