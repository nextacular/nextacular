import { getDomains } from '@/prisma/services/domain';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    await validateSession(req, res);
    const domains = await getDomains(req.query.workspaceSlug);
    res.status(200).json({ data: { domains } });
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
