import { getMembers } from '@/prisma/services/membership';
import { validateSession } from '@/config/api-validation';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    await validateSession(req, res);
    const members = await getMembers(req.query.workspaceSlug);
    res.status(200).json({ data: { members } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
