import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await getSession({ req });

    if (session) {
      const slug = req.query.workspaceSlug;
      const members = await prisma.member.findMany({
        select: {
          id: true,
          email: true,
          status: true,
          teamRole: true,
          member: { select: { name: true } },
        },
        where: {
          deletedAt: null,
          workspace: {
            deletedAt: null,
            slug,
          },
        },
      });
      res.status(200).json({ data: { members } });
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
