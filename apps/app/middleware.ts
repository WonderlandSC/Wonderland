import { clerkMiddleware, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);
  const path = url.pathname;

  // Check if accessing protected routes
  if (path.startsWith('/settings') || path.startsWith('/students')) {
    try {
      const authData = await auth();
      if (!authData.userId) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      const clerk = await clerkClient();
      const user = await clerk.users.getUser(authData.userId);
      const role = user.publicMetadata.role as string;

      if (!role || role === 'student') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Explicitly allow the request to continue
      return NextResponse.next({
        headers: {
          'x-middleware-cache': 'no-cache',
          'x-role': role,
        },
      });
    } catch (error) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};