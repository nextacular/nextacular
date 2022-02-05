import { getSession } from 'next-auth/react';

import { validateUpdateWorkspaceName } from '../../../../config/api-validation';
import prisma from '../../../../../prisma';

// import PrismaClient from 'prisma/client';
// const prisma = new PrismaClient();

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
                  userId: session.user.userId,
                  deletedAt: null,
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
        res.status(401).json({ error: 'Unauthorized access' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
