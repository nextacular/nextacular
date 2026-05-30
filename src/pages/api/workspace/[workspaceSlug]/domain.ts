import type { NextApiRequest, NextApiResponse } from 'next';

import { validateAddDomain, validateSession } from '@/config/api-validation';
import apiFetch from '@/lib/common/api';
import {
  createDomain,
  deleteDomain,
  verifyDomain,
} from '@/prisma/services/domain';

type VercelDomainResponse = {
  apexName: string;
  verified: boolean;
  verification?: ReadonlyArray<{ domain: string; value: string }>;
  error?: { code: string; message: string };
};

type VercelVerifyResponse = {
  verified: boolean;
  error?: { code: string; message: string };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const teamId = process.env.VERCEL_TEAM_ID;
  const teamSuffix = teamId ? `?teamId=${teamId}` : '';
  const vercelHeaders = {
    Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
  };
  const { workspaceSlug } = req.query as { workspaceSlug: string };

  if (method === 'POST') {
    const session = await validateSession(req, res);
    await validateAddDomain(req, res);
    const { domainName } = req.body as { domainName: string };
    const response = await apiFetch<VercelDomainResponse>(
      `${process.env.VERCEL_API_URL}/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains${teamSuffix}`,
      {
        body: { name: domainName },
        headers: vercelHeaders,
        method: 'POST',
      }
    );

    if (!response.error) {
      const { apexName, verified, verification } = response;
      await createDomain(
        session.user.userId,
        session.user.email,
        workspaceSlug,
        domainName,
        apexName,
        verified,
        verification
      );
      res.status(200).json({ data: { domain: domainName } });
    } else {
      res
        .status(response.status)
        .json({ errors: { error: { msg: response.error.message } } });
    }
  } else if (method === 'PUT') {
    const session = await validateSession(req, res);
    const { domainName } = req.body as { domainName: string };
    const response = await apiFetch<VercelVerifyResponse>(
      `${process.env.VERCEL_API_URL}/v9/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domainName}/verify${teamSuffix}`,
      {
        headers: vercelHeaders,
        method: 'POST',
      }
    );

    if (!response.error) {
      await verifyDomain(
        session.user.userId,
        session.user.email,
        workspaceSlug,
        domainName,
        response.verified
      );
      res.status(200).json({ data: { verified: response.verified } });
    } else {
      res
        .status(response.status)
        .json({ errors: { error: { msg: response.error.message } } });
    }
  } else if (method === 'DELETE') {
    const session = await validateSession(req, res);
    const { domainName } = req.body as { domainName: string };
    await apiFetch(
      `${process.env.VERCEL_API_URL}/v8/projects/${process.env.VERCEL_PROJECT_ID}/domains/${domainName}${teamSuffix}`,
      {
        headers: vercelHeaders,
        method: 'DELETE',
      }
    );
    await deleteDomain(
      session.user.userId,
      session.user.email,
      workspaceSlug,
      domainName
    );
    res.status(200).json({ data: { domain: domainName } });
  } else {
    res
      .status(405)
      .json({ errors: { error: { msg: `${method} method unsupported` } } });
  }
};

export default handler;
