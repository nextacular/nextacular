import { InvitationStatus, TeamRole } from '@prisma/client';
import { getSession } from 'next-auth/react';
import slugify from 'slugify';

import { validateCreateWorkspace } from '@/config/api-validation/index';
import { html, text } from '@/config/email-templates/workspace-create';
import { sendMail } from '@/lib/server/mail';
import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      await validateCreateWorkspace(req, res);
      const { name } = req.body;
      let slug = slugify(name.toLowerCase());
      const count = await prisma.workspace.count({
        where: { slug: { startsWith: slug } },
      });

      if (count > 0) {
        slug = `${slug}-${count}`;
      }

      const workspace = await prisma.workspace.create({
        data: {
          creatorId: session.user.userId,
          members: {
            create: {
              email: session.user.email,
              inviter: session.user.email,
              status: InvitationStatus.ACCEPTED,
              teamRole: TeamRole.OWNER,
            },
          },
          name,
          slug,
        },
      });

      await sendMail({
        html: html({ code: workspace.inviteCode, name }),
        subject: `[Nextacular] Workspace created: ${name}`,
        text: text({ code: workspace.inviteCode, name }),
        to: session.user.email,
      });
      res.status(200).json({ data: { name, slug } });
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
