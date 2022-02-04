import { getSession } from 'next-auth/react';

import prisma from '../../../../prisma';

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await getSession({ req });

    if (session) {
      const workspaces = await prisma.workspace.findMany({
        select: {
          createdAt: true,
          creator: true,
          inviteCode: true,
          members: true,
          name: true,
          slug: true,
          workspaceCode: true,
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
          },
        },
      });
      res.status(200).json({ data: { workspaces } });
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
