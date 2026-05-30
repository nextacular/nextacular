import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/server/auth';
import { getWorkspace, isWorkspaceOwner } from '@/prisma/services/workspace';

import TeamClient from './team-client';

export const metadata: Metadata = {
  title: 'Nextacular - Team Management',
};

type WorkspaceForTeam = {
  slug: string;
  name: string;
  inviteCode: string;
  inviteLink: string;
  creator: { email: string | null };
};

type PageProps = {
  params: Promise<{ workspaceSlug: string }>;
};

const TeamPage = async ({ params }: PageProps) => {
  const session = await getServerSession(authOptions);
  let isTeamOwner = false;
  let workspace: WorkspaceForTeam | null = null;

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
      workspace = {
        slug: workspaceSlug,
        name: dbWorkspace.name,
        inviteCode: dbWorkspace.inviteCode,
        inviteLink: `${process.env.APP_URL}/teams/invite?code=${encodeURI(dbWorkspace.inviteCode)}`,
        creator: { email: dbWorkspace.creator.email },
      };
    }
  }

  return <TeamClient isTeamOwner={isTeamOwner} workspace={workspace} />;
};

export default TeamPage;
