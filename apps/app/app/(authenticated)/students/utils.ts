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

export async function getCurrentUserMembership() {
  const { userId, orgId } = await auth();
  if (!orgId || !userId) return null;

  const clerk = await clerkClient();
  const memberships = await clerk.organizations.getOrganizationMembershipList({
    organizationId: orgId
  });
  
  return memberships.data.find((m: OrganizationMembership) => 
    m.publicUserData?.userId === userId
  );
}
