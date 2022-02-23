import { InvitationStatus } from '@prisma/client';
import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await getSession({ req });

    if (session) {
      const invitations = await prisma.member.findMany({
        select: {
          id: true,
          email: true,
          joinedAt: true,
          status: true,
          teamRole: true,
          invitedBy: {
            select: {
              email: true,
              name: true,
            },
          },
          workspace: {
            select: {
              createdAt: true,
              inviteCode: true,
              name: true,
              slug: true,
              workspaceCode: true,
              creator: {
                select: {
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          deletedAt: null,
          email: session.user.email,
          status: InvitationStatus.PENDING,
          workspace: { deletedAt: null },
        },
      });
      res.status(200).json({ data: { invitations } });
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
