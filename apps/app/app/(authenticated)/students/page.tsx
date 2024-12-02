"use client"
import { SyncStudentsButton } from '../components/sync-students';
import { CreateGroupModal } from '@repo/design-system/components/CreateGroupModal';
import { useState } from 'react';
import { Button } from "@repo/design-system/components/ui/button";
import { useToast } from "@repo/design-system/components/ui/use-toast";
import { GroupTabs } from '@repo/design-system/components/groups/GroupTabs';
// import { withAdminProtection } from '../components/protected-route';
import { useOrganization } from '@clerk/nextjs';

 function StudentsPage() {
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const { toast } = useToast();
  const { organization } = useOrganization();


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

  const generateInviteLink = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId: organization?.id,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to generate invite link');
      }

      const { inviteUrl } = await response.json();
      
      // Copy to clipboard
      await navigator.clipboard.writeText(inviteUrl);
      
      toast({
        title: "Success",
        description: "Invite link copied to clipboard! Link will expire in 24 hours.",
      });
    } catch (error) {
      console.error('Error generating invite link:', error);
      toast({
        title: "Error",
        description: "Failed to generate invite link",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="space-x-2">
          <Button onClick={generateInviteLink}>
            Generate Invite Link
          </Button>

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

export default StudentsPage;

// export default withAdminProtection(StudentsPage);
