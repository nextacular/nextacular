import { TeamRole } from '@prisma/client';
import { getSession } from 'next-auth/react';

import { validateWorkspaceInvite } from '@/config/api-validation/index';
import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      await validateWorkspaceInvite(req, res);
      const { members } = req.body;
      const slug = req.query.workspaceSlug;
      const workspace = await prisma.workspace.findFirst({
        select: { id: true },
        where: {
          OR: [
            { id: session.user.userId },
            {
              members: {
                some: {
                  deletedAt: null,
                  teamRole: TeamRole.OWNER,
                  email: session.user.email,
                },
              },
            },
          ],
          AND: {
            deletedAt: null,
            slug,
          },
        },
      });

      if (workspace) {
        const membersList = members.map(({ email, role }) => ({
          email,
          inviter: session.user.email,
          teamRole: role,
        }));
        const userData = members.map(({ email }) => ({
          createdAt: null,
          email,
        }));
        await Promise.all([
          prisma.user.createMany({
            data: userData,
            skipDuplicates: true,
          }),
          prisma.workspace.update({
            data: {
              members: {
                createMany: {
                  data: membersList,
                  skipDuplicates: true,
                },
              },
            },
            where: { id: workspace.id },
          }),
        ]);
        res.status(200).json({ data: { membersList } });
      } else {
        res
          .status(401)
          .json({ errors: { error: { msg: 'Unauthorized access' } } });
      }
    } else {
      res
        .status(401)
        .json({ errors: { error: { msg: 'Unauthorized access' } } });
    }
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
