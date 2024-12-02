import { database } from "@repo/database";

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return Response.json(
        { error: "Invalid token" },
        { status: 400, headers: corsHeaders }
      );
    }

    const invitation = await database.invitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      return Response.json(
        { error: "Invalid token" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (invitation.usedAt) {
      return Response.json(
        { error: "Invitation already used" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (invitation.expiresAt < new Date()) {
      return Response.json(
        { error: "Invitation expired" },
        { status: 400, headers: corsHeaders }
      );
    }

    return Response.json(
      { organizationId: invitation.organizationId },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}