import { getSession } from 'next-auth/react';

import { validateAddDomain } from '@/config/api-validation';
import prisma from '@/prisma/index';
import api from '@/lib/common/api';

const handler = async (req, res) => {
  const { method } = req;

  if (method === 'POST') {
    const session = await getSession({ req });

    if (session) {
      await validateAddDomain(req, res);
      const { domainName } = req.body;
      const teamId = process.env.VERCEL_TEAM_ID;
      const response = await api(
        `${process.env.VERCEL_API_URL}/v8/projects/${
          process.env.VERCEL_PROJECT_ID
        }/domains${teamId ? `?teamId=${teamId}` : ''}`,
        {
          body: { name: domainName },
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          },
          method: 'POST',
        }
      );

      if (!response.error) {
        const slug = req.query.workspaceSlug;
        const workspace = await prisma.workspace.findFirst({
          select: { id: true },
          where: {
            OR: [
              { id: session.user.userId },
              {
                members: {
                  some: {
                    email: session.user.email,
                    deletedAt: null,
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
        await prisma.domain.create({
          data: {
            addedById: session.user.userId,
            name: domainName,
            workspaceId: workspace.id,
          },
        });
        res.status(200).json({ data: { domain: domainName } });
      } else {
        res
          .status(response.status)
          .json({ errors: { error: { msg: response.error.message } } });
      }
    } else {
      res
        .status(401)
        .json({ errors: { error: { msg: 'Unauthorized access' } } });
    }
  } else if (method === 'DELETE') {
    const session = await getSession({ req });

    if (session) {
      const { domainName } = req.body;
      const teamId = process.env.VERCEL_TEAM_ID;
      const slug = req.query.workspaceSlug;
      await api(
        `${process.env.VERCEL_API_URL}/v8/projects/${
          process.env.VERCEL_PROJECT_ID
        }/domains/${domainName}${teamId ? `?teamId=${teamId}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
          },
          method: 'DELETE',
        }
      );
      const workspace = await prisma.workspace.findFirst({
        select: { id: true },
        where: {
          OR: [
            { id: session.user.userId },
            {
              members: {
                some: {
                  email: session.user.email,
                  deletedAt: null,
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
      const domain = await prisma.domain.findFirst({
        select: { id: true },
        where: {
          deletedAt: null,
          name: domainName,
          workspaceId: workspace.id,
        },
      });
      await prisma.domain.update({
        data: { deletedAt: new Date() },
        where: { id: domain.id },
      });
      res.status(200).json({ data: { domain: domainName } });
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
