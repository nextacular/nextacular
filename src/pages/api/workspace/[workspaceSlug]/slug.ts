import type { NextApiRequest, NextApiResponse } from 'next';

import {
  validateSession,
  validateUpdateWorkspaceSlug,
} from '@/config/api-validation/index';
import { updateSlug } from '@/prisma/services/workspace';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await validateSession(req, res);
    const { slug } = req.body as { slug: string };
    await validateUpdateWorkspaceSlug(req, res);
    const { workspaceSlug } = req.query as { workspaceSlug: string };
    updateSlug(session.user.userId, session.user.email, slug, workspaceSlug)
      .then((slug) => res.status(200).json({ data: { slug } }))
      .catch((error: Error) =>
        res.status(404).json({ errors: { error: { msg: error.message } } })
      );
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
