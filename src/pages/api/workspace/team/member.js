import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await getSession({ req });

    if (session) {
      const { memberId } = req.body;
      const deletedAt = new Date();
      await prisma.member.update({
        data: { deletedAt },
        where: { id: memberId },
      });
      res.status(200).json({ data: { deletedAt } });
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
