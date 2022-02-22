import { getSession } from 'next-auth/react';

import prisma from '../../../../../../prisma';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await getSession({ req });

    if (session) {
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
                some: {
                  email: session.user.email,
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
      const domains = await prisma.domain.findMany({
        select: {
          name: true,
        },
        where: {
          deletedAt: null,
          workspaceId: workspace.id,
        },
      });
      res.status(200).json({ data: { domains } });
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
