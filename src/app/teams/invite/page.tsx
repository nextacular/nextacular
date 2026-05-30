import type { Metadata } from 'next';

import { getInvitation } from '@/prisma/services/workspace';

import InviteClient from './invite-client';

export const metadata: Metadata = {
  title: 'Nextacular - Team Invitation',
};

type PageProps = {
  searchParams: Promise<{ code?: string }>;
};

const InvitePage = async ({ searchParams }: PageProps) => {
  const { code } = await searchParams;
  const workspace = code ? await getInvitation(code) : null;

  if (!workspace) {
    return <InviteClient workspace={null} />;
  }

  return (
    <InviteClient
      workspace={{
        id: workspace.id,
        name: workspace.name,
        workspaceCode: workspace.workspaceCode,
        slug: workspace.slug,
      }}
    />
  );
};

export default InvitePage;
