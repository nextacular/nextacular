import { getSession } from 'next-auth/react';

import { validateUpdateEmail } from '@/config/api-validation/index';
import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await getSession({ req });

    if (session) {
      await validateUpdateEmail(req, res);
      const { email } = req.body;
      await prisma.user.update({
        data: {
          email,
          emailVerified: null,
        },
        where: { id: session.user.userId },
      });
      res.status(200).json({ data: { email } });
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
