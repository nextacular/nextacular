import { getSession } from 'next-auth/react';

import { validateUpdateEmail } from '../../../config/api-validation';
import prisma from '../../../../prisma';

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await getSession({ req });

    if (session) {
      await validateUpdateEmail(req, res);
      const { email } = req.body;
      await prisma.user.update({
        data: { email, emailVerified: null },
        where: { id: session.user.userId },
      });
      res.status(200).json({ data: { email } });
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
