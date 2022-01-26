import { getSession } from 'next-auth/react';

import { validateUpdateName } from '../../../config/api-validation';
import prisma from '../../../../prisma';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await getSession({ req });

    if (session) {
      await validateUpdateName(req, res);
      const { name } = req.body;
      await prisma.user.update({
        data: { name },
        where: { id: session.user.userId },
      });
      res.status(200).json({ data: { name } });
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
