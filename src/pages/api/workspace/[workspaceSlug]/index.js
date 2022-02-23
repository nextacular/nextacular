import { TeamRole } from '@prisma/client';
import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const ALLOW_DEACTIVATION = false;

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await getSession({ req });

    if (session) {
      const slug = req.query.workspaceSlug;
      const workspace = await prisma.workspace.findFirst({
        select: { id: true },
        where: {
          OR: [
            { id: session.user.userId },
            {
              members: {
                some: {
                  deletedAt: null,
                  teamRole: TeamRole.OWNER,
                  email: session.user.email,
                },
              },
            },
          ],
          AND: {
            deletedAt: null,
            slug,
          },
        },
      });

      if (workspace) {
        if (ALLOW_DEACTIVATION) {
          await prisma.workspace.update({
            data: { deletedAt: new Date() },
            where: { id: workspace.id },
          });
        }
        res.status(200).json({ data: { slug } });
      } else {
        res
          .status(401)
          .json({ errors: { error: { msg: 'Unauthorized access' } } });
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
