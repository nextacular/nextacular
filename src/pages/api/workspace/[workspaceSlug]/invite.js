import { TeamRole } from '@prisma/client';

import {
  validateWorkspaceInvite,
  validateSession,
} from '@/config/api-validation/index';
import { html, text } from '@/config/email-templates/invitation';
import { sendMail } from '@/lib/server/mail';
import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    await validateSession(req, res);
    await validateWorkspaceInvite(req, res);
    const { members } = req.body;
    const slug = req.query.workspaceSlug;
    const workspace = await prisma.workspace.findFirst({
      select: {
        id: true,
        inviteCode: true,
        name: true,
      },
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
        createUsers(userData),
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
        sendMail({
          html: html({ code: workspace.inviteCode, name: workspace.name }),
          subject: `[Nextacular] You have been invited to join ${workspace.name} workspace`,
          text: text({ code: workspace.inviteCode, name: workspace.name }),
          to: members.map((member) => member.email),
        }),
      ]);
      res.status(200).json({ data: { membersList } });
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
