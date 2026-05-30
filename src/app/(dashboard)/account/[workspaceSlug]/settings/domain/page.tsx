import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/server/auth';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';

import DomainClient from './domain-client';

export const metadata: Metadata = {
  title: 'Nextacular - Workspace Domains',
};

type WorkspaceForDomain = {
  slug: string;
  name: string;
  host: string;
  hostname: string;
};

type PageProps = {
  params: Promise<{ workspaceSlug: string }>;
};

const DomainPage = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);
  let isTeamOwner = false;
  let workspace: WorkspaceForDomain | null = null;

  if (session?.user) {
    const { workspaceSlug } = await params;
    const dbWorkspace = workspaceSlug
      ? await getWorkspace(
          session.user.userId,
          session.user.email,
          workspaceSlug
        )
      : null;

    if (dbWorkspace && process.env.APP_URL) {
      const { host } = new URL(process.env.APP_URL);
      isTeamOwner = isWorkspaceOwner(session.user.email, dbWorkspace);
      workspace = {
        slug: workspaceSlug,
        name: dbWorkspace.name,
        host,
        hostname: `${workspaceSlug}.${host}`,
      };
    }
  }

  return <DomainClient isTeamOwner={isTeamOwner} workspace={workspace} />;
};

export default DomainPage;
