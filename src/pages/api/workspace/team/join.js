import { InvitationStatus } from '@prisma/client';
import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      const { workspaceCode } = req.body;
      const workspace = await prisma.workspace.findFirst({
        select: {
          creatorId: true,
          id: true,
        },
        where: {
          deletedAt: null,
          workspaceCode,
        },
      });

      if (workspace) {
        const member = await prisma.member.findFirst({
          where: { email: session.user.email },
        });

        if (!member) {
          await prisma.member.create({
            data: {
              workspaceId: workspace.id,
              email: session.user.email,
              inviter: workspace.creatorId,
              status: InvitationStatus.ACCEPTED,
            },
          });
          res.status(200).json({ data: { joinedAt: new Date() } });
        } else {
          res.status(422).json({
            errors: {
              error: { msg: 'You are already a member of this workspace' },
            },
          });
        }
      } else {
        res
          .status(404)
          .json({ errors: { error: { msg: 'Unable to find workspace' } } });
      }
    } else {
      res
        .status(401)
        .json({ errors: { error: { msg: 'Unauthorized access' } } });
    }
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
