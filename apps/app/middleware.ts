import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";

const middleware = async (auth: any, req: Request) => {
  try {
    // Get the current path from the URL
    const url = new URL(req.url);
    const path = url.pathname;

    // Resolve the auth object
    const resolvedAuth = typeof auth === 'function' ? await auth() : auth;
    
    // Debug logs
    // console.log('Path:', path);
    // console.log('Resolved Auth:', resolvedAuth);
    // console.log('Session claims:', resolvedAuth?.sessionClaims);
    // console.log('Org role:', resolvedAuth?.sessionClaims?.org_role);

    // Check if the path is protected (settings or students)
    const isProtectedRoute = path.startsWith('/settings') || path.startsWith('/students');

    // If it's a protected route and user is not an admin, redirect to home
    if (isProtectedRoute) {
      const isAdmin = resolvedAuth?.sessionClaims?.org_role === "org:admin";
      // console.log('Is admin?', isAdmin);
      
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // console.error('Middleware error:', error);
    return NextResponse.next();
  }
};

// Apply the middleware
export default clerkMiddleware(middleware);

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};