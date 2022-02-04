import { getSession } from 'next-auth/react';
import slugify from 'slugify';

import { validateCreateWorkspace } from '../../../config/api-validation';
import prisma from '../../../../prisma';

// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      await validateCreateWorkspace(req, res);
      const { name } = req.body;
      let slug = slugify(name.toLowerCase());
      const count = await prisma.workspace.count({
        where: {
          slug,
        },
      });

      if (count > 0) {
        slug = `${slug}-${count}`;
      }

      await prisma.workspace.create({
        data: {
          creatorId: session.user.userId,
          members: {
            create: {
              email: session.user.email,
              userId: session.user.userId,
            },
          },
          name,
          slug,
        },
      });
      res.status(200).json({ data: { name, slug } });
    } else {
      res.status(401).json({ error: 'Unauthorized access' });
    }
  } else {
    res.status(405).json({ error: `${method} method unsupported` });
  }
};

export default handler;
