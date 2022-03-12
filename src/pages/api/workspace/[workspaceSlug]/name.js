import {
  validateSession,
  validateUpdateWorkspaceName,
} from '@/config/api-validation/index';
import { updateName } from '@/prisma/services/workspace';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await validateSession(req, res);
    await validateUpdateWorkspaceName(req, res);
    const { name } = req.body;
    updateName(
      session.user.userId,
      session.user.email,
      name,
      req.query.workspaceSlug
    )
      .then((name) => res.status(200).json({ data: { name } }))
      .catch((error) =>
        res.status(404).json({ errors: { error: { msg: error.message } } })
      );
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
