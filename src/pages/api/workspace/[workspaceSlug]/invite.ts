import type { NextApiRequest, NextApiResponse } from 'next';

import {
  validateSession,
  validateWorkspaceInvite,
} from '@/config/api-validation/index';
import {
  inviteUsers,
  type WorkspaceMemberInvite,
} from '@/prisma/services/workspace';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await validateSession(req, res);
    await validateWorkspaceInvite(req, res);
    const { members } = req.body as { members: WorkspaceMemberInvite[] };
    const { workspaceSlug } = req.query as { workspaceSlug: string };
    inviteUsers(session.user.userId, session.user.email, members, workspaceSlug)
      .then((members) => res.status(200).json({ data: { members } }))
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
