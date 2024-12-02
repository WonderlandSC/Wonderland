import { clerkMiddleware, type ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/api/invitations/verify",
  "/api/invitations/complete",
  "/sign-up/verify-email-address",
  "/verify-email",
  "/.well-known/*",
  "/",
];

const middlewareHandler = clerkMiddleware(async (auth: ClerkMiddlewareAuth, req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Allow public paths and paths with tokens
  if (publicRoutes.some(publicPath => path.startsWith(publicPath)) || url.searchParams.has('token')) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const isProtectedRoute = path.startsWith('/settings') || path.startsWith('/students');
  if (isProtectedRoute) {
    const authObject = await auth();
    console.log("Resolved auth object:", authObject);

    const userId = authObject.userId;
    const orgId = authObject.orgId;
    const orgRole = authObject.sessionClaims?.org_role;

    if (!userId || !orgId || orgRole !== "org:admin") {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  return NextResponse.next();
});

export default middlewareHandler;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};