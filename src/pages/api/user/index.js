import { getSession } from 'next-auth/react';

import prisma from '../../../../prisma';

const allowDeactivation = false;

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await getSession({ req });

    if (session) {
      if (allowDeactivation) {
        await prisma.user.update({
          data: {
            deletedAt: new Date(),
          },
          where: {
            id: session.user.userId,
          },
        });
      }
      res.status(200).json({ data: { email: session.user.email } });
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
