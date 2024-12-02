import { auth } from "@clerk/nextjs/server";
import { database } from "@repo/database";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const organizationId = searchParams.get('organizationId');
    const { userId } = await auth();

    if (!token || !organizationId || !userId) {
      console.log('Missing parameters:', { token, organizationId, userId });
      return Response.redirect(new URL('/dashboard', req.url));
    }

    // Find and update the invitation
    const invitation = await database.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      console.log('Invalid invitation token:', token);
      return Response.redirect(new URL('/dashboard', req.url));
    }

    if (invitation.usedAt) {
      console.log('Invitation already used:', token);
      return Response.redirect(new URL('/dashboard', req.url));
    }

    // Mark invitation as used
    await database.invitation.update({
      where: { token },
      data: { 
        usedAt: new Date(),
        usedById: userId
      },
    });

    console.log('Invitation marked as used:', token);

    // Redirect to dashboard
    return Response.redirect(new URL('/dashboard', req.url));
  } catch (error) {
    console.error('Error completing invitation:', error);
    return Response.redirect(new URL('/dashboard', req.url));
  }
}