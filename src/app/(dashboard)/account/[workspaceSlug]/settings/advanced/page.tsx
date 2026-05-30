import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/server/auth';
import { getWorkspace, isWorkspaceCreator } from '@/prisma/services/workspace';

import AdvancedClient from './advanced-client';

export const metadata: Metadata = {
  title: 'Nextacular - Advanced Settings',
};

type PageProps = {
  params: Promise<{ workspaceSlug: string }>;
};

const AdvancedPage = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);
  let isCreator = false;

  if (session?.user) {
    const { workspaceSlug } = await params;
    const workspace = workspaceSlug
      ? await getWorkspace(
          session.user.userId,
          session.user.email,
          workspaceSlug
        )
      : null;

    if (workspace) {
      isCreator = isWorkspaceCreator(session.user.userId, workspace.creatorId);
    }
  }

  return <AdvancedClient isCreator={isCreator} />;
};

export default AdvancedPage;
