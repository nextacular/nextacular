import { getSession } from 'next-auth/react';

import prisma from '@/prisma/index';

const ALLOW_DEACTIVATION = false;

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await getSession({ req });

    if (session) {
      if (ALLOW_DEACTIVATION) {
        await prisma.user.update({
          data: { deletedAt: new Date() },
          where: { id: session.user.userId },
        });
      }
      res.status(200).json({ data: { email: session.user.email } });
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
