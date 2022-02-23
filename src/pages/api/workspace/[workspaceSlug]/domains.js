import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await getSession({ req });

    if (session) {
      const slug = req.query.workspaceSlug;
      const domains = await prisma.domain.findMany({
        select: { name: true },
        where: {
          deletedAt: null,
          workspace: {
            deletedAt: null,
            slug,
          },
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
