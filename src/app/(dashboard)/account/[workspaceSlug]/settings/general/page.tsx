import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/server/auth';
import type { Workspace } from '@/providers/workspace';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';

import GeneralClient from './general-client';

export const metadata: Metadata = {
  title: 'Nextacular - Workspace Settings',
};

type PageProps = {
  params: Promise<{ workspaceSlug: string }>;
};

const GeneralPage = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);
  let isTeamOwner = false;
  let workspace: Workspace | null = null;

  if (session?.user) {
    const { workspaceSlug } = await params;
    const dbWorkspace = workspaceSlug
      ? await getWorkspace(
          session.user.userId,
          session.user.email,
          workspaceSlug
        )
      : null;

    if (dbWorkspace) {
      isTeamOwner = isWorkspaceOwner(session.user.email, dbWorkspace);
      workspace = { ...(dbWorkspace as Workspace), slug: workspaceSlug };
    }
  }

  return <GeneralClient isTeamOwner={isTeamOwner} workspace={workspace} />;
};

export default GeneralPage;
