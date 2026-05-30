import type { NextApiRequest, NextApiResponse } from 'next';
import slugify from 'slugify';

import {
  validateCreateWorkspace,
  validateSession,
} from '@/config/api-validation/index';
import { createWorkspace } from '@/prisma/services/workspace';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await validateSession(req, res);
    await validateCreateWorkspace(req, res);
    const { name } = req.body as { name: string };
    const slug = slugify(name.toLowerCase());
    await createWorkspace(session.user.userId, session.user.email, name, slug);
    res.status(200).json({ data: { name, slug } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
