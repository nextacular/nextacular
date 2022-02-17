import { TeamRole } from '@prisma/client';
import { getSession } from 'next-auth/react';

import { validateUpdateWorkspaceName } from '../../../../config/api-validation';
import prisma from '../../../../../prisma';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await getSession({ req });

    if (session) {
      await validateUpdateWorkspaceName(req, res);
      const { name } = req.body;
      const slug = req.query.workspaceSlug;

      const workspace = await prisma.workspace.findFirst({
        select: {
          id: true,
        },
        where: {
          OR: [
            {
              id: session.user.userId,
            },
            {
              members: {
                every: {
                  deletedAt: null,
                  teamRole: TeamRole.OWNER,
                  userId: session.user.userId,
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
        await prisma.workspace.update({
          data: {
            name,
          },
          where: {
            id: workspace.id,
          },
        });
        res.status(200).json({ data: { name } });
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
