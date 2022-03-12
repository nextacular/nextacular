import { validateSession } from '@/config/api-validation';
import { deactivate } from '@/prisma/services/user';

const ALLOW_DEACTIVATION = false;

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'DELETE') {
    const session = await validateSession(req, res);
    if (ALLOW_DEACTIVATION) {
      await deactivate(session.user.userId);
    }
    res.status(200).json({ data: { email: session.user.email } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
