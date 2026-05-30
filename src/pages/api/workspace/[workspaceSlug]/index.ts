import type { NextApiRequest, NextApiResponse } from 'next';

import { validateSession } from '@/config/api-validation';
import { deleteWorkspace } from '@/prisma/services/workspace';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await validateSession(req, res);
    const { workspaceSlug } = req.query as { workspaceSlug: string };
    deleteWorkspace(session.user.userId, session.user.email, workspaceSlug)
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
