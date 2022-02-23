import { InvitationStatus } from '@prisma/client';
import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await getSession({ req });

    if (session) {
      const { memberId } = req.body;
      await prisma.member.update({
        data: { status: InvitationStatus.ACCEPTED },
        where: { id: memberId },
      });
      res.status(200).json({ data: { updatedAt: new Date() } });
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
