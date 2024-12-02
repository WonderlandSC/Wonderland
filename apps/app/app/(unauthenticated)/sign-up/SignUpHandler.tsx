"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpHandler() {
  const router = useRouter();

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const storedToken = localStorage.getItem('invitationToken');
    const urlToken = currentUrl.searchParams.get('token');
    
    console.log('SignUpHandler - Current URL:', currentUrl.toString());
    console.log('SignUpHandler - URL token:', urlToken);
    console.log('SignUpHandler - Stored token:', storedToken);
    
    const isSignUpFlow = currentUrl.pathname.startsWith('/sign-up') || 
                        urlToken || 
                        storedToken;

    console.log('SignUpHandler - Is sign-up flow:', isSignUpFlow);

    if (isSignUpFlow) {
      // Allow the sign-up flow to proceed
      return;
    }

    // Clean up stored token if we're not in sign-up flow
    localStorage.removeItem('invitationToken');
    localStorage.removeItem('tokenTimestamp');
    
    // Redirect to sign-in if not in sign-up flow
    console.log('SignUpHandler - Redirecting to sign-in');
    router.push('/sign-in');
  }, [router]);

  return null;
}