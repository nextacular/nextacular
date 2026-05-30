import type { NextApiRequest, NextApiResponse } from 'next';

import { validateSession } from '@/config/api-validation';
import apiFetch from '@/lib/common/api';

type VercelDomainConfig = {
  configuredBy?: string | null;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'GET') {
    await validateSession(req, res);
    const { domain } = req.query as { domain: string };
    const teamId = process.env.VERCEL_TEAM_ID;
    const response = await apiFetch<VercelDomainConfig>(
      `${process.env.VERCEL_API_URL}/v6/domains/${domain}/config${
        teamId ? `?teamId=${teamId}` : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
        },
        method: 'GET',
      }
    );
    const valid = response?.configuredBy ? true : false;
    res.status(200).json({ data: { valid } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
