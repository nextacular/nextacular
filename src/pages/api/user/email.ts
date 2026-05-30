import type { NextApiRequest, NextApiResponse } from 'next';

import {
  validateSession,
  validateUpdateEmail,
} from '@/config/api-validation/index';
import { updateEmail } from '@/prisma/services/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await validateSession(req, res);
    await validateUpdateEmail(req, res);
    const { email } = req.body as { email: string };
    await updateEmail(session.user.userId, email, session.user.email);
    res.status(200).json({ data: { email } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
