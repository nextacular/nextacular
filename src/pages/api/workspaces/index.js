import { validateSession } from '@/config/api-validation';
import { getWorkspaces } from '@/prisma/services/workspace';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'GET') {
    const session = await validateSession(req, res);
    const workspaces = await getWorkspaces(
      session.user.userId,
      session.user.email
    );
    res.status(200).json({ data: { workspaces } });
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
