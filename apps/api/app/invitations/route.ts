import { getAuth } from "@clerk/nextjs/server"; 
import { database } from "@repo/database";
import { add } from "date-fns";
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";
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

export async function POST(req: Request) {
  console.log('POST /invitations called');
  
  try {
    // Get auth information from request headers
    const { userId, orgId } = getAuth(req as NextRequest);
    console.log('Auth info:', { userId, orgId });

    if (!userId || !orgId) {
      console.log('Unauthorized - missing userId or orgId');
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', body);
    } catch (e) {
      console.log('Failed to parse request body:', e);
      return Response.json(
        { error: 'Invalid request body' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { organizationId } = body;
    if (!organizationId) {
      console.log('Missing organizationId in request');
      return Response.json(
        { error: 'organizationId is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Generate invitation
    const token = nanoid(32);
    console.log('Generated token:', token);
    
    const invitation = await database.invitation.create({
      data: {
        token,
        organizationId,
        expiresAt: add(new Date(), { hours: 24 }),
      },
    });
    console.log('Created invitation:', invitation);

    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign-up?token=${token}`;
    console.log('Generated invite URL:', inviteUrl);

    return Response.json({ inviteUrl }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in POST /invitations:', error);
    return Response.json(
      { error: 'Failed to create invitation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: corsHeaders }
    );
  }
}