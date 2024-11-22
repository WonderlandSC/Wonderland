import { NextRequest, NextResponse } from 'next/server';
import { database } from '@repo/database';
import { clerkClient } from '@clerk/nextjs/server';


const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_APP_URL || 'https://your-production-url.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',  // Add this line
  'Access-Control-Max-Age': '86400',
} as const;

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {


  try {
    const { organizationId } = await request.json();
    
    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 });
    }

    const clerk = await clerkClient();
    const memberships = await clerk.organizations.getOrganizationMembershipList({
      organizationId,
    });
    
    const students = memberships.data.filter(
      (member) => member.role !== 'org:admin'
    );

    for (const member of students) {
      if (!member.publicUserData?.userId) continue;

      const user = await clerk.users.getUser(member.publicUserData.userId);

      await database.student.upsert({
        where: { clerkId: user.id },
        update: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.emailAddresses[0]?.emailAddress || '',
          organizationId,
        },
        create: {
          id: member.id,
          clerkId: user.id,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.emailAddresses[0]?.emailAddress || '',
          organizationId,
        },
      });
    }

    return NextResponse.json({ success: true }, { 
      headers: corsHeaders  // This is correct
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}