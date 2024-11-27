"use client"
import { SyncStudentsButton } from '../components/sync-students';
import { CreateGroupModal } from '@repo/design-system/components/CreateGroupModal';
import { useState } from 'react';
import { Button } from "@repo/design-system/components/ui/button";
import { useToast } from "@repo/design-system/components/ui/use-toast";
import { GroupTabs } from '@repo/design-system/components/groups/GroupTabs';
import { MinusIcon, PlusIcon } from 'lucide-react';
export default function StudentsPage() {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const { toast } = useToast();


  const handleCreateGroup = async (groupData: {
    name: string;
    description: string;
    regularPrice: number;
    earlyBirdPrice: number;
    earlyBirdDeadline: Date;
    schedule: string;
  }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create group');
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: `Group "${data.group.name}" created successfully`,
      });
      setIsCreateGroupModalOpen(false);
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsCreateGroupModalOpen(true)}>
            Create Group
          </Button>

          <SyncStudentsButton />
        </div>
      </div>
      
      <CreateGroupModal
        isOpen={isCreateGroupModalOpen}
        onClose={() => setIsCreateGroupModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
      <GroupTabs />
    </div>
  );
}