import { validateSession } from '@/config/api-validation';
import api from '@/lib/common/api';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    await validateSession(req, res);
    const { domain } = req.query;
    const teamId = process.env.VERCEL_TEAM_ID;
    const response = await api(
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
