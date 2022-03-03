import { TeamRole } from '@prisma/client';
import { getSession } from 'next-auth/react';
import slugify from 'slugify';

import { validateUpdateWorkspaceSlug } from '@/config/api-validation/index';
import prisma from '@/prisma/index';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'PUT') {
    const session = await getSession({ req });

    if (session) {
      await validateUpdateWorkspaceSlug(req, res);
      let { slug } = req.body;
      const pathSlug = req.query.workspaceSlug;
      slug = slugify(slug.toLowerCase());
      const count = await prisma.workspace.count({
        where: { slug: { startsWith: slug } },
      });

      if (count > 0) {
        slug = `${slug}-${count}`;
      }

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
            slug: pathSlug,
          },
        },
      });

      if (workspace) {
        await prisma.workspace.update({
          data: { slug },
          where: { id: workspace.id },
        });
        res.status(200).json({ data: { slug } });
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
