'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from "@repo/design-system/components/ui/use-toast";

export function SyncStudentsButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const syncStudents = async () => {
    setIsSyncing(true);
    try {
      const token = await getToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sync failed');
      }
      
      const data = await response.json();
      toast({
        title: "Success",
        description: `Successfully synced ${data.syncedCount} users`,
      });
      
      router.refresh();
    } catch (error) {
      console.error('Sync error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to sync users',
        variant: "destructive",
      });
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