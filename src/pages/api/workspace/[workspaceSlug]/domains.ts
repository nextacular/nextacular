import type { NextApiRequest, NextApiResponse } from 'next';

import { validateSession } from '@/config/api-validation';
import { getDomains } from '@/prisma/services/domain';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'GET') {
    await validateSession(req, res);
    const { workspaceSlug } = req.query as { workspaceSlug: string };
    const domains = await getDomains(workspaceSlug);
    res.status(200).json({ data: { domains } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
