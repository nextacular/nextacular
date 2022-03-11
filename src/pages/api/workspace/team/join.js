import { validateSession } from '@/config/api-validation';
import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    await validateSession(req, res);
    const { workspaceCode } = req.body;
    const workspace = await prisma.workspace.findFirst({
      select: {
        creatorId: true,
        id: true,
      },
      where: {
        deletedAt: null,
        workspaceCode,
      },
    });

    if (workspace) {
      await createNewRecord(
        workspace.id,
        session.user.email,
        workspace.creatorId
      );
      res.status(200).json({ data: { joinedAt: new Date() } });
    } else {
      res
        .status(404)
        .json({ errors: { error: { msg: 'Unable to find workspace' } } });
    }
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
