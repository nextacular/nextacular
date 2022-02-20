import { InvitationStatus, Prisma, PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

// import prisma from '../../../../../prisma';
const prisma = new PrismaClient();

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      const slug = req.query.workspaceSlug;
      const workspace = await prisma.workspace.findFirst({
        select: {
          id: true,
        },
        where: {
          slug,
        },
      });

      if (workspace) {
        await prisma.member.update({
          data: {
            status: InvitationStatus.ACCEPTED,
          },
          where: {
            workspaceId_email: {
              email: session.user.email,
              workspaceId: workspace.id,
            },
          },
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
