import { getSession } from 'next-auth/react';

// import prisma from '@/prisma/index';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await getSession({ req });

    if (session) {
      const { memberId } = req.body;
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
      const domain = await prisma.domain.findFirst({
        select: {
          id: true,
        },
        where: {
          deletedAt: null,
          name: domainName,
          workspaceId: workspace.id,
        },
      });
      await prisma.domain.update({
        data: {
          deletedAt: new Date(),
        },
        where: {
          id: domain.id,
        },
      });
      res.status(200).json({ data: { domain: domainName } });
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
