import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const token = searchParams.get('token');
  const organizationId = searchParams.get('organizationId');

  // Forward the request to your API
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/invitations/complete?token=${token}&organizationId=${organizationId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  // Get the redirect URL from the API response
  const redirectUrl = response.headers.get('Location') || '/dashboard';
  
  return Response.redirect(new URL(redirectUrl, process.env.NEXT_PUBLIC_APP_URL));
}