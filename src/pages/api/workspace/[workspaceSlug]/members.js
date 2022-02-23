import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await getSession({ req });

    if (session) {
      const slug = req.query.workspaceSlug;
      const workspace = await prisma.workspace.findFirst({
        select: {
          members: {
            select: {
              email: true,
              status: true,
              teamRole: true,
              member: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
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

      res.status(200).json({ data: { members: workspace?.members || [] } });
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
