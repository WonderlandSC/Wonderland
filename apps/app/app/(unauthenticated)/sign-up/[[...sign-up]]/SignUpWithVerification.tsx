"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SignUp } from '@clerk/nextjs';

interface SignUpWithVerificationProps {
  title: string;
  description: string;
}

interface VerificationResponse {
  organizationId: string;
}

export const SignUpWithVerification = ({ title, description }: SignUpWithVerificationProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      
      if (token) {
        // Store token when we first receive it
        localStorage.setItem('invitationToken', token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());
      }

      // Try to get token from URL or localStorage
      const storedToken = localStorage.getItem('invitationToken');
      const tokenToUse = token || storedToken;

      if (!tokenToUse) {
        console.error('No token found in URL or storage');
        router.push('/sign-in');
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/verify?token=${tokenToUse}`);
        
        if (!response.ok) {
          console.error('Token verification failed');
          localStorage.removeItem('invitationToken');
          localStorage.removeItem('tokenTimestamp');
          router.push('/sign-in');
          return;
        }

        const data: VerificationResponse = await response.json();
        setOrganizationId(data.organizationId);
        setIsValidToken(true);
      } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('invitationToken');
        localStorage.removeItem('tokenTimestamp');
        router.push('/sign-in');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [searchParams, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isValidToken || !organizationId) {
    return null;
  }

  const token = searchParams.get('token') || new URL(window.location.href).searchParams.get('token');
  // Use the app URL instead of the API URL
  const completeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/invitations/complete?token=${token}&organizationId=${organizationId}`;

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="font-semibold text-2xl tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <SignUp 
        path="/sign-up"
        routing="path"
        afterSignInUrl={completeUrl}
        afterSignUpUrl={completeUrl}
        signInUrl="/sign-in"
        redirectUrl={completeUrl}
        appearance={{
          elements: {
            rootBox: {
              width: '100%',
            },
          },
        }}
      />
    </>
  );
};