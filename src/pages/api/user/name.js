import { getSession } from 'next-auth/react';

import { validateUpdateName } from '@/config/api-validation/index';
import prisma from '@/prisma/index';

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
