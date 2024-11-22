import { auth, OrganizationMembership } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

export async function getStudentData(membershipId: string) {
  const { orgId } = await auth();
  if (!orgId) notFound();

  const clerk = await clerkClient();
  const memberships = await clerk.organizations.getOrganizationMembershipList({
    organizationId: orgId
  });
  
  const orgMembership = memberships.data.find((m: OrganizationMembership) => 
    m.id === membershipId
  );
  if (!orgMembership || !orgMembership.publicUserData?.userId) notFound();

  const student = await clerk.users.getUser(orgMembership.publicUserData.userId);
  
  return {
    membership: orgMembership,
    student
  };
}
