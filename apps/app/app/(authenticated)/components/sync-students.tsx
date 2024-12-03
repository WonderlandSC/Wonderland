'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SyncStudentsButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const syncStudents = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sync failed: ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`Successfully synced ${data.syncedCount} users`);
      
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
      {isSyncing ? 'Syncing All Users...' : 'Sync All Users'}
    </Button>
  );
}