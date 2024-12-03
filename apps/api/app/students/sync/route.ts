import { NextRequest } from 'next/server';
import { database } from '@repo/database';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { corsHeaders, handleCors } from '../../../lib/cors';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return handleCors(
        Response.json(
          { error: 'Unauthorized' }, 
          { status: 401 }
        )
      );
    }

    // Fetch all users from Clerk
    const clerk = await clerkClient();
    const { data: users } = await clerk.users.getUserList();
    
    // Sync each user to the database and update Clerk metadata
    for (const user of users) {
      const student = await database.student.upsert({
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
          role: 'student', // Default role
        },
      });

      // Update Clerk metadata with the role
      await clerk.users.updateUser(user.id, {
        publicMetadata: { role: student.role }
      });
    }

    return handleCors(
      Response.json({ 
        success: true,
        syncedCount: users.length 
      })
    );
  } catch (error) {
    console.error('Sync error:', error);
    return handleCors(
      Response.json(
        { error: 'Internal Server Error' }, 
        { status: 500 }
      )
    );
  }
}