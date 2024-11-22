'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { useOrganization } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SyncStudentsButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { organization } = useOrganization();
  const router = useRouter();

  const syncStudents = async () => {
    if (!organization) return;
    
    setIsSyncing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          organizationId: organization.id,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sync failed: ${errorText}`);
      }
      
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        console.error('Sync error:', error.message);
      } else {
        console.error('Unknown sync error:', error);
      }
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      onClick={syncStudents} 
      disabled={isSyncing}
    >
      {isSyncing ? 'Syncing...' : 'Sync Students'}
    </Button>
  );
}