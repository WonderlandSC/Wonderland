import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const { userId } = await auth();

  // If signed in, redirect to dashboard
  if (userId) {
    redirect('/dashboard');
  }

  // If not signed in, redirect to sign-in
  redirect('/sign-in');
}